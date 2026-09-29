import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router/app_router.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(
    // ProviderScope is the root of the Riverpod state tree.
    // Wrap the entire app so any widget can access providers.
    const ProviderScope(child: InspexApp()),
  );
}

class InspexApp extends ConsumerWidget {
  const InspexApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Read the router once � go_router is provided via Riverpod for testability
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'PROTOTYPE',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      routerConfig: router,
    );
  }
}
