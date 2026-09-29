import 'dashboard_screen.dart';
import 'package:flutter/material.dart';

import 'dart:io';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';

import '../theme/app_theme.dart';
import '../router/app_router.dart';
import '../providers/home_provider.dart';

// =============================================================================
// HomeScreen — converted from index.html + style.css + script.js
// =============================================================================
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final showRejectModal = ref.watch(rejectModalProvider);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: AppColors.bgColor,
        floatingActionButton: Padding(
          padding: const EdgeInsets.only(bottom: 70.0),
          child: FloatingActionButton(
            onPressed: () => context.push(AppRoutes.chat),
            backgroundColor: AppColors.primaryBlue,
            child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
          ),
        ),
        body: Stack(
          children: [
            Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _AppHeader(),
                        const SizedBox(height: 24),
                        const _ProfileCard(),
                        const SizedBox(height: 32),
                        const _NewAssignmentsSection(),
                        const SizedBox(height: 36),
                        const _TodayInspectionSection(),
                        const SizedBox(height: 36),
                        const _ActionRequiredSection(),
                        const SizedBox(height: 36),
                        const _QuickActionsSection(),
                        const SizedBox(height: 36),
                        const _DepartmentUpdatesSection(),
                        const SizedBox(height: 36),
                        const _ImportantResourcesSection(),
                        const SizedBox(height: 100),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const Positioned(left: 0, right: 0, bottom: 0, child: AppBottomNav()),
            if (showRejectModal) ...[
              _ModalOverlay(onTap: () => ref.read(rejectModalProvider.notifier).state = false),
              const _RejectModal(),
            ],
          ],
        ),
      ),
    );
  }
}
// =============================================================================
// App Header
// =============================================================================
class _AppHeader extends ConsumerWidget {
  const _AppHeader();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final avatarUrl = ref.watch(avatarProvider);
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 48, 20, 20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(16)),
        boxShadow: [BoxShadow(color: Color(0x0F000000), blurRadius: 15, offset: Offset(0, 4))],
      ),
      child: Row(
        children: [
          CachedNetworkImage(
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg',
            width: 36,
            errorWidget: (ctx, url, err) => const Icon(Icons.account_balance, size: 36, color: AppColors.primaryBlue),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Government of India', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textDark)),
              const SizedBox(height: 2),
              Text('Department of Social Justice & Empowerment', style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
            ],
          ),
          const Spacer(),
          GestureDetector(
            onTap: () => context.push(AppRoutes.notifications),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                const FaIcon(FontAwesomeIcons.bell, size: 24, color: AppColors.primaryBlue),
                Positioned(
                  top: -4, right: -4,
                  child: Container(
                    width: 18, height: 18,
                    decoration: BoxDecoration(color: AppColors.dangerRed, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
                    child: const Center(child: Text('3', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold))),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// Profile Card
// =============================================================================
class _ProfileCard extends ConsumerWidget {
  const _ProfileCard();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final avatarUrl = ref.watch(avatarProvider);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(24),
      decoration: AppDecorations.profileCard,
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('INSPECTION OFFICER', style: GoogleFonts.nunito(fontSize: 11, letterSpacing: 0.8, fontWeight: FontWeight.w600, color: Colors.white.withValues(alpha: 0.9))),
                const SizedBox(height: 6),
                Text('Rajesh Kumar', style: GoogleFonts.nunito(fontSize: 22, fontWeight: FontWeight.w700, color: Colors.white)),
                const SizedBox(height: 4),
                Text('Officer ID: INS-2026-0142', style: GoogleFonts.nunito(fontSize: 13, color: Colors.white.withValues(alpha: 0.9))),
                const SizedBox(height: 4),
                Text('District Inspection Officer', style: GoogleFonts.nunito(fontSize: 13, color: Colors.white.withValues(alpha: 0.9))),
              ],
            ),
          ),
          ClipOval(
            child: avatarUrl.startsWith('http')
              ? CachedNetworkImage(
                  imageUrl: avatarUrl,
                  width: 68, height: 68, fit: BoxFit.cover,
                  errorWidget: (ctx, url, err) => Container(
                    width: 68, height: 68,
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.3), shape: BoxShape.circle),
                    child: const Icon(Icons.person, size: 36, color: Colors.white),
                  ),
                )
              : Image.file(
                  File(avatarUrl),
                  width: 68, height: 68, fit: BoxFit.cover,
                  errorBuilder: (ctx, err, stackTrace) => Container(
                    width: 68, height: 68,
                    decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.3), shape: BoxShape.circle),
                    child: const Icon(Icons.person, size: 36, color: Colors.white),
                  ),
                ),
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// Section Header helper
// =============================================================================
class _SectionHeader extends StatelessWidget {
  final FaIconData icon;
  final String title;
  final String? actionLabel;
  const _SectionHeader({required this.icon, required this.title, this.actionLabel});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          FaIcon(icon, size: 16, color: AppColors.primaryBlue),
          const SizedBox(width: 8),
          Text(title, style: AppTextStyles.sectionTitle),
          const Spacer(),
          if (actionLabel != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(color: AppColors.accentLightBlue, borderRadius: BorderRadius.circular(20)),
              child: Text(actionLabel!, style: AppTextStyles.tagBlue),
            ),
        ],
      ),
    );
  }
}

// =============================================================================
// New Inspection Assignments
// =============================================================================
class _NewAssignmentsSection extends ConsumerWidget {
  const _NewAssignmentsSection();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(icon: FontAwesomeIcons.bell, title: 'NEW INSPECTION ASSIGNMENTS', actionLabel: 'View All'),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(20),
          decoration: AppDecorations.card,
          child: Column(
            children: [
              Row(
                children: [
                  Container(
                    width: 52, height: 52,
                    decoration: const BoxDecoration(color: AppColors.accentLightBlue, shape: BoxShape.circle),
                    child: const Center(child: FaIcon(FontAwesomeIcons.building, size: 22, color: AppColors.primaryBlue)),
                  ),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('ABC Welfare Foundation', style: AppTextStyles.cardTitle),
                      const SizedBox(height: 6),
                      Row(children: [const FaIcon(FontAwesomeIcons.locationDot, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('Pune, Maharashtra', style: AppTextStyles.bodyMuted)]),
                      const SizedBox(height: 6),
                      Row(children: [const FaIcon(FontAwesomeIcons.calendarDays, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('06 September 2026', style: AppTextStyles.bodyMuted)]),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(child: ElevatedButton(onPressed: () {}, child: const Text('ACCEPT'))),
                  const SizedBox(width: 16),
                  Expanded(child: OutlinedButton(onPressed: () => ref.read(rejectModalProvider.notifier).state = true, child: const Text('REJECT'))),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// Today Inspection Section
// =============================================================================
class _TodayInspectionSection extends StatelessWidget {
  const _TodayInspectionSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionHeader(icon: FontAwesomeIcons.calendarCheck, title: "TODAY'S INSPECTION"),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(20),
          decoration: AppDecorations.card,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // NEW CARD: Current Assignment (Just-in-time)
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 52, height: 52,
                    decoration: const BoxDecoration(color: AppColors.primaryBlue, shape: BoxShape.circle),
                    child: const Center(child: FaIcon(FontAwesomeIcons.clipboardList, size: 22, color: Colors.white)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(child: Text('Current Assignment', style: AppTextStyles.cardTitle, overflow: TextOverflow.ellipsis)),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(color: AppColors.accentLightBlue, borderRadius: BorderRadius.circular(12)),
                              child: Text('JUST-IN-TIME', style: AppTextStyles.tagBlue),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text('Proj ID: PRJ-2026-9901', style: AppTextStyles.bodyMuted),
                        const SizedBox(height: 6),
                        Row(children: [const FaIcon(FontAwesomeIcons.locationDot, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('Details reveal in 60 min', style: AppTextStyles.bodyMuted)]),
                        const SizedBox(height: 6),
                        Row(children: [const FaIcon(FontAwesomeIcons.clock, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('11:00 AM', style: AppTextStyles.bodyMuted)]),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () {}, child: const Text('VIEW ASSIGNMENT'))),
              
              const Padding(padding: EdgeInsets.symmetric(vertical: 16), child: Divider()),
              
              // EXISTING CARD: ABC Welfare Foundation
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 52, height: 52,
                    decoration: const BoxDecoration(color: AppColors.primaryBlue, shape: BoxShape.circle),
                    child: const Center(child: FaIcon(FontAwesomeIcons.clipboardList, size: 22, color: Colors.white)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Flexible(child: Text('ABC Welfare Foundation', style: AppTextStyles.cardTitle, overflow: TextOverflow.ellipsis)),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(color: AppColors.accentLightBlue, borderRadius: BorderRadius.circular(12)),
                              child: Text('UPCOMING', style: AppTextStyles.tagBlue),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(children: [const FaIcon(FontAwesomeIcons.locationDot, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('Pune, Maharashtra', style: AppTextStyles.bodyMuted)]),
                        const SizedBox(height: 6),
                        Row(children: [const FaIcon(FontAwesomeIcons.clock, size: 12, color: AppColors.textMuted), const SizedBox(width: 6), Text('10:30 AM', style: AppTextStyles.bodyMuted)]),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              SizedBox(width: double.infinity, child: ElevatedButton(onPressed: () { context.push(AppRoutes.startInspection); }, child: const Text('START INSPECTION'))),
              const SizedBox(height: 16),
              Center(
                child: GestureDetector(
                  onTap: () {},
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(color: AppColors.accentLightBlue, borderRadius: BorderRadius.circular(20)),
                    child: Text("View Today's Inspections", style: AppTextStyles.tagBlue),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// Action Required
// =============================================================================
class _ActionRequiredSection extends StatelessWidget {
  const _ActionRequiredSection();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionHeader(icon: FontAwesomeIcons.triangleExclamation, title: 'ACTION REQUIRED'),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(20),
          decoration: AppDecorations.cardWarning,
          child: Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      width: 52, height: 52,
                      decoration: const BoxDecoration(color: AppColors.warningOrange, shape: BoxShape.circle),
                      child: const Center(child: FaIcon(FontAwesomeIcons.triangleExclamation, size: 22, color: Colors.white)),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Report Pending', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.warningOrange)),
                          const SizedBox(height: 4),
                          Text('Inspection INS-2841 requires report submission.', style: GoogleFonts.nunito(fontSize: 12, color: AppColors.textDark)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              OutlinedButton(
                style: OutlinedButton.styleFrom(foregroundColor: AppColors.warningOrange, side: const BorderSide(color: AppColors.warningOrange), padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10)),
                onPressed: () {},
                child: Text('COMPLETE REPORT \u2192', textAlign: TextAlign.center, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w700)),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// Quick Actions Grid
// =============================================================================
class _QuickActionsSection extends StatelessWidget {
  const _QuickActionsSection();

  @override
  Widget build(BuildContext context) {
    final items = [
      (icon: FontAwesomeIcons.clipboardList, label: 'Inspection\nChecklist', route: AppRoutes.inspectionChecklist),
      (icon: FontAwesomeIcons.locationDot,   label: 'Inspection\nMap',       route: ''),
      (icon: FontAwesomeIcons.fileSignature, label: 'Draft\nReports',        route: ''),
      (icon: FontAwesomeIcons.users,          label: 'Video call',           route: ''),
      (icon: FontAwesomeIcons.bookOpen,       label: 'Guidelines',           route: ''),
      (icon: FontAwesomeIcons.video,          label: 'CCTV',                 route: ''),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const _SectionHeader(icon: FontAwesomeIcons.bolt, title: 'QUICK ACTIONS'),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(24),
          decoration: AppDecorations.navyGrid,
          child: GridView.count(
            crossAxisCount: 3,
            crossAxisSpacing: 14, mainAxisSpacing: 14,
            shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            children: items.map((e) => _GridTile(icon: e.icon, label: e.label, route: e.route)).toList(),
          ),
        ),
      ],
    );
  }
}

class _GridTile extends StatelessWidget {
  final FaIconData icon;
  final String label;
  final String route;
  const _GridTile({required this.icon, required this.label, required this.route});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () { if (route.isNotEmpty) context.go(route); },
      child: Container(
        decoration: AppDecorations.gridItem,
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            FaIcon(icon, size: 24, color: AppColors.primaryBlue),
            const SizedBox(height: 10),
            Text(label, textAlign: TextAlign.center, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textDark, height: 1.3)),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// Department Updates
// =============================================================================
class _DepartmentUpdatesSection extends StatelessWidget {
  const _DepartmentUpdatesSection();

  @override
  Widget build(BuildContext context) {
    final updates = [
      (title: 'New Inspection Guidelines — 2026', date: '04 Sept 2026'),
      (title: 'Updated Inspection Checklist',     date: '02 Sept 2026'),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(icon: FontAwesomeIcons.newspaper, title: 'DEPARTMENT UPDATES', actionLabel: 'View All'),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          decoration: AppDecorations.card,
          child: Column(
            children: List.generate(updates.length * 2 - 1, (i) {
              if (i.isOdd) return const Divider(height: 1, indent: 20, endIndent: 20, color: AppColors.borderColor);
              final item = updates[i ~/ 2];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                child: Row(
                  children: [
                    Container(
                      width: 40, height: 40,
                      decoration: const BoxDecoration(color: AppColors.accentLightBlue, shape: BoxShape.circle),
                      child: const Center(child: FaIcon(FontAwesomeIcons.fileLines, size: 18, color: AppColors.primaryBlue)),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.title, style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark)),
                          const SizedBox(height: 4),
                          Text(item.date, style: AppTextStyles.bodyMuted),
                        ],
                      ),
                    ),
                    const FaIcon(FontAwesomeIcons.chevronRight, size: 14, color: AppColors.textMuted),
                  ],
                ),
              );
            }),
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// Important Resources
// =============================================================================
class _ImportantResourcesSection extends StatelessWidget {
  const _ImportantResourcesSection();

  @override
  Widget build(BuildContext context) {
    final items = [
      (icon: FontAwesomeIcons.book,           label: 'Inspection\nGuidelines'),
      (icon: FontAwesomeIcons.clipboardList,  label: 'Inspection\nSteps'),
      (icon: FontAwesomeIcons.scaleBalanced,  label: 'Acts &\nRules'),
      (icon: FontAwesomeIcons.fileContract,   label: 'SOPs'),
      (icon: FontAwesomeIcons.fileLines,      label: 'Report\nFormats'),
      (icon: FontAwesomeIcons.circleQuestion, label: 'FAQs &\nHelp'),
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeader(icon: FontAwesomeIcons.link, title: 'IMPORTANT RESOURCES', actionLabel: 'View All'),
        const SizedBox(height: 16),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 20),
          padding: const EdgeInsets.all(24),
          decoration: AppDecorations.navyGrid,
          child: GridView.count(
            crossAxisCount: 3,
            crossAxisSpacing: 14, mainAxisSpacing: 14,
            shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            children: items.map((e) => _GridTile(icon: e.icon, label: e.label, route: '')).toList(),
          ),
        ),
      ],
    );
  }
}

// =============================================================================
// Bottom Navigation
// =============================================================================
class AppBottomNav extends ConsumerWidget {
  const AppBottomNav();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final activeIndex = ref.watch(bottomNavIndexProvider);
    return Container(
      height: 75,
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Color(0x0F000000), blurRadius: 15, offset: Offset(0, -4))],
      ),
      child: Row(
        children: [
          _NavItem(icon: FontAwesomeIcons.house,         label: 'Home',        index: 0, activeIndex: activeIndex, onTap: () { ref.read(bottomNavIndexProvider.notifier).state = 0; context.go(AppRoutes.home); }),
          _NavItem(icon: FontAwesomeIcons.clipboardList, label: 'Inspections', index: 1, activeIndex: activeIndex, onTap: () { ref.read(bottomNavIndexProvider.notifier).state = 1; context.go(AppRoutes.inspectionHome); }),
          _NavItem(icon: FontAwesomeIcons.camera,        label: 'Geo Tag',     index: 2, activeIndex: activeIndex, onTap: () { ref.read(bottomNavIndexProvider.notifier).state = 2; context.go(AppRoutes.geoTag); }),
          _NavItem(icon: FontAwesomeIcons.user,          label: 'Dashboard',   index: 3, activeIndex: activeIndex, onTap: () { ref.read(bottomNavIndexProvider.notifier).state = 3; context.go(AppRoutes.dashboard); }),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final FaIconData icon;
  final String label;
  final int index;
  final int activeIndex;
  final VoidCallback onTap;
  const _NavItem({required this.icon, required this.label, required this.index, required this.activeIndex, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isActive = index == activeIndex;
    final color = isActive ? AppColors.primaryBlue : const Color(0xFF94A3B8);
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 14),
            FaIcon(icon, size: 22, color: color),
            const SizedBox(height: 6),
            Text(label, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
          ],
        ),
      ),
    );
  }
}

// =============================================================================
// Modal Overlay
// =============================================================================
class _ModalOverlay extends StatelessWidget {
  final VoidCallback onTap;
  const _ModalOverlay({required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(onTap: onTap, child: Container(color: AppColors.overlay));
}

// =============================================================================
// Reject Modal — converted from rejection popup + script.js logic
// =============================================================================
class _RejectModal extends ConsumerStatefulWidget {
  const _RejectModal();

  @override
  ConsumerState<_RejectModal> createState() => _RejectModalState();
}

class _RejectModalState extends ConsumerState<_RejectModal> {
  String? _selectedReason;
  final _customCtrl = TextEditingController();
  bool _canConfirm = false;

  static const _options = [
    (value: 'Scheduling conflict',          label: 'Scheduling conflict'),
    (value: 'Location / travel constraint', label: 'Location / travel constraint'),
    (value: 'Conflict of Interest',         label: 'Conflict of Interest'),
    (value: 'Unavailability / Emergency',   label: 'Unavailability / Emergency'),
    (value: 'CUSTOM',                        label: 'Custom reason'),
  ];

  void _validate() {
    setState(() {
      if (_selectedReason == null) { _canConfirm = false; return; }
      _canConfirm = (_selectedReason == 'CUSTOM') ? _customCtrl.text.trim().isNotEmpty : true;
    });
  }

  void _confirm() {
    ref.read(rejectModalProvider.notifier).state = false;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
      content: Row(children: [
        const Icon(Icons.check_circle, color: Color(0xFF4ADE80)),
        const SizedBox(width: 10),
        Text('Inspection assignment rejected.', style: GoogleFonts.nunito(fontWeight: FontWeight.w600)),
      ]),
      backgroundColor: AppColors.textDark,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
      duration: const Duration(seconds: 3),
    ));
  }

  @override
  void dispose() { _customCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        constraints: const BoxConstraints(maxWidth: 380),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: const [BoxShadow(color: Color(0x200B3D91), blurRadius: 40, offset: Offset(0, 20))],
        ),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon badge
              Container(
                width: 44, height: 44,
                decoration: const BoxDecoration(color: AppColors.lightRejection, shape: BoxShape.circle),
                child: const Center(child: FaIcon(FontAwesomeIcons.triangleExclamation, size: 20, color: AppColors.rejectionRed)),
              ),
              const SizedBox(height: 12),
              Text('Reject Assignment', style: GoogleFonts.nunito(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.textDark)),
              const SizedBox(height: 8),
              Text('Please select a reason for rejecting this inspection assignment.', textAlign: TextAlign.center, style: AppTextStyles.bodyMuted),
              const SizedBox(height: 20),
              Align(
                alignment: Alignment.centerLeft,
                child: Text('REJECTION REASON', style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 0.5)),
              ),
              const SizedBox(height: 10),
              ...(_options.map((opt) {
                final isSelected = _selectedReason == opt.value;
                return GestureDetector(
                  onTap: () { setState(() => _selectedReason = opt.value); _validate(); },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFEAF4FF) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.borderColor),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 20, height: 20,
                          decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.borderColor, width: 2)),
                          child: isSelected ? Center(child: Container(width: 9, height: 9, decoration: const BoxDecoration(color: AppColors.primaryBlue, shape: BoxShape.circle))) : null,
                        ),
                        const SizedBox(width: 12),
                        Text(opt.label, style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textDark)),
                      ],
                    ),
                  ),
                );
              }).toList()),
              const SizedBox(height: 8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Detailed Explanation', style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                  const SizedBox(height: 6),
                  TextField(
                    controller: _customCtrl,
                    maxLength: 500,
                    maxLines: 3,
                    onChanged: (_) { setState(() => _selectedReason = 'CUSTOM'); _validate(); },
                    decoration: InputDecoration(
                      hintText: 'Enter your reason for rejecting this inspection...',
                      hintStyle: AppTextStyles.bodyMuted,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.borderColor)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primaryBlue)),
                      contentPadding: const EdgeInsets.all(12),
                      counterStyle: AppTextStyles.bodyMuted,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity, height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _canConfirm ? AppColors.rejectionRed : AppColors.disabledBg,
                    foregroundColor: _canConfirm ? Colors.white : AppColors.disabled,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  onPressed: _canConfirm ? _confirm : null,
                  child: Text('CONFIRM REJECTION', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700)),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity, height: 44,
                child: OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.primaryBlue,
                    side: const BorderSide(color: AppColors.borderColor),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => ref.read(rejectModalProvider.notifier).state = false,
                  child: Text('CANCEL', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
