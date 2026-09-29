import 'package:flutter_riverpod/flutter_riverpod.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Rejection Modal visibility state — from script.js openModal/closeModal logic
// ─────────────────────────────────────────────────────────────────────────────
final rejectModalProvider = StateProvider<bool>((ref) => false);

// ─────────────────────────────────────────────────────────────────────────────
// Bottom Navigation active index
// ─────────────────────────────────────────────────────────────────────────────
final bottomNavIndexProvider = StateProvider<int>((ref) => 0);