import 'package:cpsl_flutter/auth_examples/email_auth_example.dart';
import 'package:cpsl_flutter/auth_examples/oauth_auth_example.dart';
import 'package:cpsl_flutter/auth_examples/phone_auth_example.dart';
import 'package:cpsl_flutter/auth_examples/pregen_auth_examle.dart';
import 'package:cpsl_flutter/client/capsule.dart';
import 'package:flutter/material.dart';

class DemoAuthSelector extends StatefulWidget {
  const DemoAuthSelector({super.key});

  @override
  State<DemoAuthSelector> createState() => _DemoAuthSelectorState();
}

class _DemoAuthSelectorState extends State<DemoAuthSelector> {
  @override
  void initState() {
    super.initState();
    capsuleClient.logout();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Capsule SDK Examples'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'Authentication Examples',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Select an authentication method to view its implementation example using the Capsule SDK.',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 32),

              // Email + Passkey Example
              _buildExampleCard(
                context: context,
                title: 'Email + Passkey Authentication',
                description: 'Implement email-based authentication with passkey support for enhanced security.',
                route: const CapsuleEmailExample(),
                icon: Icons.email_outlined,
              ),
              const SizedBox(height: 16),

              // Phone + Passkey Example
              _buildExampleCard(
                context: context,
                title: 'Phone + Passkey Authentication',
                description: 'Add phone number authentication with passkey support to your application.',
                route: const CapsulePhoneExample(),
                icon: Icons.phone_android_outlined,
              ),
              const SizedBox(height: 16),

              // OAuth Example
              _buildExampleCard(
                context: context,
                title: 'OAuth Authentication',
                description: 'Integrate popular OAuth providers (Google, Apple, X, Discord) into your app.',
                route: const CapsuleOAuthExample(),
                icon: Icons.account_circle_outlined,
              ),
              const SizedBox(height: 16),

              // Pregen Example
              _buildExampleCard(
                context: context,
                title: 'Pregen Wallet Authentication',
                description: 'Create and manage pre-generated wallets using various identifier types.',
                route: const CapsulePregenExample(),
                icon: Icons.wallet_outlined,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildExampleCard({
    required BuildContext context,
    required String title,
    required String description,
    required Widget route,
    required IconData icon,
  }) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => route),
          );
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    icon,
                    size: 24,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_ios,
                    size: 16,
                    color: Colors.grey[600],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}