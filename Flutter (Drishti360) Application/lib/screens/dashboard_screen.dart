import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';

import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../router/app_router.dart';
import '../theme/app_theme.dart';

// State provider for the avatar image URL
final avatarProvider = StateProvider<String>((ref) {
  return 'https://i.pravatar.cc/150?img=11';
});

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final avatarUrl = ref.watch(avatarProvider);
    const Color primaryDarkBlue = Color(0xFF14345C);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: primaryDarkBlue,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.home);
            }
          },
        ),
        title: Text(
          'Dashboard',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile Section
            Container(
              width: double.infinity,
              padding: const EdgeInsets.only(top: 30, bottom: 24, left: 20, right: 20),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: Color(0xFFF8FAFC), width: 8)),
              ),
              child: Stack(
                alignment: Alignment.topCenter,
                children: [
                  Column(
                    children: [
                      // Avatar
                      GestureDetector(
                        onTap: () => _showPhotoModal(context, avatarUrl),
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: const Color(0xFFF1F5F9), width: 3),
                          ),
                          child: ClipOval(
                            child: avatarUrl.startsWith('http') ? CachedNetworkImage(
                              imageUrl: avatarUrl,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => const CircularProgressIndicator(),
                              errorWidget: (context, url, error) => const Icon(Icons.person),
                            ) : Image.file(File(avatarUrl), fit: BoxFit.cover),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Rajesh Kumar',
                        style: GoogleFonts.nunito(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: primaryDarkBlue,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Officer ID: PMU-INS-10294',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const FaIcon(FontAwesomeIcons.locationDot, size: 12, color: Color(0xFF64748B)),
                          const SizedBox(width: 6),
                          Text(
                            'Pune District',
                            style: GoogleFonts.nunito(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  // Action buttons
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Row(
                      children: [
                        _ActionButton(
                          icon: FontAwesomeIcons.pen,
                          bgColor: const Color(0xFFE0F2FE),
                          iconColor: const Color(0xFF0284C7),
                          onTap: () async {
                            final picker = ImagePicker();
                            final picked = await picker.pickImage(source: ImageSource.gallery);
                            if (picked != null) {
                              ref.read(avatarProvider.notifier).state = picked.path;
                            }
                          },
                        ),
                        const SizedBox(width: 12),
                        _ActionButton(
                          icon: FontAwesomeIcons.trash,
                          bgColor: const Color(0xFFFEE2E2),
                          iconColor: const Color(0xFFDC2626),
                          onTap: () => _confirmDeletePhoto(context, ref),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            // Menu List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Column(
                children: [
                  _MenuItem(
                    title: 'Personal Information',
                    subtitle: 'View and manage your profile details',
                    icon: FontAwesomeIcons.user,
                    bgColor: const Color(0xFFE0F2FE),
                    iconColor: const Color(0xFF0284C7),
                    route: AppRoutes.personalProfile,
                  ),
                  _MenuItem(
                    title: 'Inspection Overview',
                    subtitle: 'Summary of your inspections and status',
                    icon: FontAwesomeIcons.fileLines, // closest to fa-file-alt
                    bgColor: const Color(0xFFDCFCE7),
                    iconColor: const Color(0xFF16A34A),
                    route: AppRoutes.inspectionOverview,
                  ),
                  _MenuItem(
                    title: 'Performance & Analytics',
                    subtitle: 'Track your performance and key metrics',
                    icon: FontAwesomeIcons.chartBar,
                    bgColor: const Color(0xFFE0E7FF),
                    iconColor: const Color(0xFF4F46E5),
                    route: AppRoutes.performanceAnalysis,
                  ),
                  _MenuItem(
                    title: 'Upcoming Inspections',
                    subtitle: 'View your next scheduled inspections',
                    icon: FontAwesomeIcons.calendarDays, // closest to fa-calendar-alt
                    bgColor: const Color(0xFFFFEDD5),
                    iconColor: const Color(0xFFEA580C),
                    route: AppRoutes.upcomingInspections,
                  ),
                  _MenuItem(
                    title: 'Inspection History',
                    subtitle: 'Access your past inspection records',
                    icon: FontAwesomeIcons.clockRotateLeft, // closest to fa-history
                    bgColor: const Color(0xFFCCFBF1),
                    iconColor: const Color(0xFF0D9488),
                    route: AppRoutes.inspectionHistory,
                  ),
                  _MenuItem(
                    title: 'Pending Actions',
                    subtitle: 'Check pending reports, follow-ups and more',
                    icon: FontAwesomeIcons.bell,
                    bgColor: const Color(0xFFFEE2E2),
                    iconColor: const Color(0xFFDC2626),
                    route: AppRoutes.pendingActions,
                  ),
                  _MenuItem(
                    title: 'Inspection Reports',
                    subtitle: 'View and manage your inspection reports',
                    icon: FontAwesomeIcons.clipboardList,
                    bgColor: const Color(0xFFE0F2FE),
                    iconColor: const Color(0xFF0284C7),
                    route: AppRoutes.inspectionReport,
                  ),
                  _MenuItem(
                    title: 'Settings',
                    subtitle: 'App settings and preferences',
                    icon: FontAwesomeIcons.gear, // closest to fa-cog
                    bgColor: const Color(0xFFF1F5F9),
                    iconColor: const Color(0xFF334155),
                    route: null,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _confirmDeletePhoto(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remove Photo'),
        content: const Text('Are you sure you want to remove your profile photo?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('CANCEL'),
          ),
          TextButton(
            onPressed: () {
              ref.read(avatarProvider.notifier).state =
                  'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=cbd5e1&color=1e293b&size=150';
              Navigator.of(ctx).pop();
            },
            child: const Text('REMOVE', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showPhotoModal(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.85),
      builder: (ctx) => Stack(
        alignment: Alignment.center,
        children: [
          GestureDetector(
            onTap: () => Navigator.of(ctx).pop(),
            child: Container(
              color: Colors.transparent,
              width: double.infinity,
              height: double.infinity,
            ),
          ),
          CachedNetworkImage(
            imageUrl: imageUrl,
            fit: BoxFit.contain,
          ),
          Positioned(
            top: 40,
            right: 25,
            child: IconButton(
              icon: const Icon(Icons.close, color: Colors.white, size: 30),
              onPressed: () => Navigator.of(ctx).pop(),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final FaIconData icon;
  final Color bgColor;
  final Color iconColor;
  final VoidCallback onTap;

  const _ActionButton({
    required this.icon,
    required this.bgColor,
    required this.iconColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: bgColor,
          shape: BoxShape.circle,
        ),
        child: Center(
          child: FaIcon(icon, size: 14, color: iconColor),
        ),
      ),
    );
  }
}

class _MenuItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final FaIconData icon;
  final Color bgColor;
  final Color iconColor;
  final String? route;

  const _MenuItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.bgColor,
    required this.iconColor,
    this.route,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          if (route != null) {
            context.push(route!);
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Settings coming soon')),
            );
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: const Color(0xFFF1F5F9)),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Center(
                  child: FaIcon(icon, size: 20, color: iconColor),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF14345C),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right_rounded,
                color: Color(0xFFCBD5E1),
                size: 24,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
