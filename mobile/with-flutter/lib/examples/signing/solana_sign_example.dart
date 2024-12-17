import 'dart:convert';

import 'package:cpsl_flutter/client/capsule.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:capsule/capsule.dart';
import 'package:solana_web3/solana_web3.dart' as web3;
import 'package:solana_web3/programs.dart' as programs;

class SolanaSignExample extends StatefulWidget {
  final Wallet wallet;

  const SolanaSignExample({
    super.key,
    required this.wallet,
  });

  @override
  State<SolanaSignExample> createState() => _SolanaSignExampleState();
}

class _SolanaSignExampleState extends State<SolanaSignExample> {
  final _formKey = GlobalKey<FormState>();
  final _recipientController = TextEditingController();
  final _amountController = TextEditingController();
  bool _isLoading = false;
  String? _lastSignature;
  String? _error;

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _signTransaction() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _lastSignature = null;
      _error = null;
    });

    try {
      final connection = web3.Connection(web3.Cluster.devnet);

      final publicKey = web3.Pubkey.fromBase58(widget.wallet.address!);

      final blockhash = await connection.getLatestBlockhash();

      // Convert amount to lamports
      final lamports = web3.solToLamports(double.parse(_amountController.text));

      // Create transaction
      final transaction = web3.Transaction.v0(
        payer: publicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: [
          programs.SystemProgram.transfer(
            fromPubkey: publicKey,
            toPubkey: web3.Pubkey.fromBase58(_recipientController.text),
            lamports: lamports,
          ),
        ],
      );

      // Serialize the message
      final message = Uint8List.fromList(transaction.serializeMessage().toList());

      // Convert to base64 for Capsule API
      final messageBase64 = base64Encode(message);

      // Sign the message using Capsule
      final result = await capsuleClient.signMessage(
        walletId: widget.wallet.id!,
        messageBase64: messageBase64,
      );

      late final Uint8List signature;
      if (result is SuccessfulSignatureResult) {
        signature = base64.decode(result.signature);
      } else if (result is DeniedSignatureResultWithUrl) {
        throw Exception('Signature denied: ${result.transactionReviewUrl}');
      } else {
        throw Exception('Signature denied');
      }

      // Add the signature to the transaction
      transaction.addSignature(publicKey, signature);

      // Get the signature as a base58 string
      final signatureString = web3.base58.encode(transaction.signature!);

      setState(() {
        _lastSignature = signatureString;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Solana Sign Example'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Sign Solana Transaction',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Example of signing a transfer transaction on Solana.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 32),
                TextFormField(
                  controller: _recipientController,
                  decoration: const InputDecoration(
                    labelText: 'Recipient Address',
                    hintText: 'Enter Solana address',
                    prefixIcon: Icon(Icons.account_balance_wallet_outlined),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a recipient address';
                    }
                    try {
                      web3.Pubkey.fromBase58(value);
                      return null;
                    } catch (_) {
                      return 'Invalid Solana address';
                    }
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _amountController,
                  decoration: const InputDecoration(
                    labelText: 'Amount (SOL)',
                    hintText: 'Enter amount in SOL',
                    prefixIcon: Icon(Icons.attach_money),
                  ),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*$')),
                  ],
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter an amount';
                    }
                    final amount = double.tryParse(value);
                    if (amount == null || amount <= 0) {
                      return 'Please enter a valid amount';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _signTransaction,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Sign Transaction'),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 24),
                  Text(
                    _error!,
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.error,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
                if (_lastSignature != null) ...[
                  const SizedBox(height: 24),
                  const Text(
                    'Transaction Signature:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              _lastSignature!,
                              style: const TextStyle(fontFamily: 'monospace'),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.copy),
                            onPressed: () {
                              Clipboard.setData(ClipboardData(text: _lastSignature!));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Signature copied to clipboard')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
