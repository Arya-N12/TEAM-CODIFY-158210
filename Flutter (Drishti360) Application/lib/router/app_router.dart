import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/home_screen.dart';
import '../screens/inspection_home_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/notifications_screen.dart';
import '../screens/report_screen.dart';
import '../screens/inspection_overview_screen.dart';
import '../screens/inspection_history_screen.dart';
import '../screens/inspection_report_screen.dart';
import '../screens/pending_actions_screen.dart';
import '../screens/upcoming_inspections_screen.dart';
import '../screens/performance_analysis_screen.dart';
import '../screens/personal_profile_screen.dart';
import '../screens/inspection_checklist_screen.dart';
import '../screens/start_inspection_screen.dart';
import '../screens/rejected_inspection_screen.dart';
import '../screens/geo_tag_screen.dart';
import '../screens/chat_screen.dart';

class AppRoutes {
  AppRoutes._();

  static const String home                = '/';
  static const String inspectionHome      = '/inspections';
  static const String dashboard           = '/dashboard';
  static const String inspectionOverview  = '/dashboard/overview';
  static const String inspectionHistory   = '/dashboard/history';
  static const String inspectionReport    = '/dashboard/reports';
  static const String pendingActions      = '/dashboard/pending';
  static const String upcomingInspections = '/dashboard/upcoming';
  static const String performanceAnalysis = '/dashboard/performance';
  static const String personalProfile     = '/dashboard/profile';
  static const String inspectionChecklist = '/inspection/checklist';
  static const String startInspection     = '/inspection/start';
  static const String notifications       = '/notifications';
  static const String report              = '/report';
  static const String rejectedInspection  = '/rejected';
  static const String geoTag              = '/geo-tag';
  static const String chat                = '/chat';
}

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.home,
    debugLogDiagnostics: true,
    routes: [
      GoRoute(
        path: AppRoutes.home,
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: AppRoutes.inspectionHome,
        name: 'inspectionHome',
        builder: (context, state) => const InspectionHomeScreen(),
      ),
      GoRoute(
        path: AppRoutes.dashboard,
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: AppRoutes.notifications,
        name: 'notifications',
        builder: (context, state) => const NotificationsScreen(),
      ),
      GoRoute(
        path: AppRoutes.inspectionOverview,
        name: 'inspectionOverview',
        builder: (context, state) => const InspectionOverviewScreen(),
      ),
      GoRoute(
        path: AppRoutes.inspectionHistory,
        name: 'inspectionHistory',
        builder: (context, state) => const InspectionHistoryScreen(),
      ),
      GoRoute(
        path: AppRoutes.inspectionReport,
        name: 'inspectionReport',
        builder: (context, state) => const InspectionReportScreen(),
      ),
      GoRoute(
        path: AppRoutes.pendingActions,
        name: 'pendingActions',
        builder: (context, state) => const PendingActionsScreen(),
      ),
      GoRoute(
        path: AppRoutes.upcomingInspections,
        name: 'upcomingInspections',
        builder: (context, state) => const UpcomingInspectionsScreen(),
      ),
      GoRoute(
        path: AppRoutes.performanceAnalysis,
        name: 'performanceAnalysis',
        builder: (context, state) => const PerformanceAnalysisScreen(),
      ),
      GoRoute(
        path: AppRoutes.personalProfile,
        name: 'personalProfile',
        builder: (context, state) => const PersonalProfileScreen(),
      ),
      GoRoute(
        path: AppRoutes.inspectionChecklist,
        name: 'inspectionChecklist',
        builder: (context, state) => const InspectionChecklistScreen(),
      ),
      GoRoute(
        path: AppRoutes.startInspection,
        name: 'startInspection',
        builder: (context, state) => const StartInspectionScreen(),
      ),
      GoRoute(
        path: AppRoutes.report,
        name: 'report',
        builder: (context, state) => const ReportScreen(),
      ),
      GoRoute(
        path: AppRoutes.rejectedInspection,
        name: 'rejectedInspection',
        builder: (context, state) => const RejectedInspectionScreen(),
      ),
      GoRoute(
        path: AppRoutes.geoTag,
        name: 'geoTag',
        builder: (context, state) => const GeoTagScreen(),
      ),
      GoRoute(
        path: AppRoutes.chat,
        name: 'chat',
        builder: (context, state) => const ChatScreen(),
      ),
    ],
  );
});

class PlaceholderScreen extends StatelessWidget {
  final String title;
  const PlaceholderScreen({super.key, required this.title});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(child: Text('\ — coming soon')),
    );
  }
}
