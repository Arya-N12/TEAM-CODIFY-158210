import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../router/app_router.dart';

class PendingActionRecord {
  final int id;
  final String name;
  final String location;
  final String inspectionDate;
  final String scheduleType;
  final String actionType;
  final String priority;
  final String deadline;
  final bool urgent;
  final String buttonText;

  PendingActionRecord({
    required this.id,
    required this.name,
    required this.location,
    required this.inspectionDate,
    required this.scheduleType,
    required this.actionType,
    required this.priority,
    required this.deadline,
    required this.urgent,
    required this.buttonText,
  });
}

class PendingActionsScreen extends StatefulWidget {
  const PendingActionsScreen({super.key});

  @override
  State<PendingActionsScreen> createState() => _PendingActionsScreenState();
}

class _PendingActionsScreenState extends State<PendingActionsScreen> {
  static const Color primaryBlue = Color(0xFF0B3D91);
  static const Color bgColor = Color(0xFFF3F4F6); // modern gray background
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color dangerRed = Color(0xFFEF4444);
  static const Color warningOrange = Color(0xFFF59E0B);
  static const Color badgeBg = Color(0xFFEFF6FF);
  static const Color badgeText = Color(0xFF3B82F6);
  static const Color chipActiveBg = Color(0xFF0B3D91);
  static const Color chipInactiveBg = Color(0xFFFFFFFF);

  String _searchQuery = '';
  String _activeFilter = 'All'; // Action Type Filter
  String _priorityFilter = 'All';
  String _sortBy = 'deadline'; // deadline, priority, dateNewest

  final List<PendingActionRecord> _allActions = [
    PendingActionRecord(
      id: 101,
      name: 'ABC Welfare Foundation',
      location: 'Pune, Maharashtra',
      inspectionDate: '16 September 2026',
      scheduleType: 'Scheduled',
      actionType: 'Pending Report',
      priority: 'High',
      deadline: '20 September 2026',
      urgent: true,
      buttonText: 'Submit Report',
    ),
    PendingActionRecord(
      id: 102,
      name: 'Sunrise Care Institute',
      location: 'Pune, Maharashtra',
      inspectionDate: '14 September 2026',
      scheduleType: 'Surprise',
      actionType: 'Evidence Submission',
      priority: 'High',
      deadline: '19 September 2026',
      urgent: true,
      buttonText: 'Upload Evidence',
    ),
    PendingActionRecord(
      id: 103,
      name: 'National Rehabilitation Centre',
      location: 'Hadapsar, Pune',
      inspectionDate: '10 September 2026',
      scheduleType: 'Scheduled',
      actionType: 'Review Required',
      priority: 'Medium',
      deadline: '22 September 2026',
      urgent: false,
      buttonText: 'Review Details',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    var filtered = _allActions.where((a) {
      bool matchesSearch = a.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
             a.location.toLowerCase().contains(_searchQuery.toLowerCase());
      bool matchesFilter = _activeFilter == 'All' || a.actionType == _activeFilter;
      bool matchesPriority = _priorityFilter == 'All' || a.priority == _priorityFilter;
      return matchesSearch && matchesFilter && matchesPriority;
    }).toList();

    filtered.sort((a, b) {
      if (_sortBy == 'deadline') return a.deadline.compareTo(b.deadline);
      if (_sortBy == 'dateNewest') return b.inspectionDate.compareTo(a.inspectionDate);
      return a.priority.compareTo(b.priority); // Simple string sort for demo
    });

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        shadowColor: Colors.black12,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textDark, size: 24),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.dashboard);
            }
          },
        ),
        title: Text(
          'Pending Actions',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textDark,
          ),
        ),
        centerTitle: false,
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // PAGE HEADER
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Action Required',
                              style: GoogleFonts.nunito(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: dangerRed,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Complete your outstanding inspection tasks.',
                              style: GoogleFonts.nunito(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                          boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
                        ),
                        child: Column(
                          children: [
                            Text(
                              '${filtered.length}',
                              style: GoogleFonts.nunito(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: dangerRed,
                              ),
                            ),
                            Text(
                              'Pending',
                              style: GoogleFonts.nunito(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // CONTROLS SECTION
                  // Search Bar
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: GoogleFonts.nunito(fontSize: 15, color: textDark, fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      hintText: 'Search by organization, location, or task...',
                      hintStyle: GoogleFonts.nunito(color: textMuted, fontWeight: FontWeight.w500),
                      prefixIcon: const Icon(Icons.search, color: textMuted),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: borderColor),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: borderColor),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: primaryBlue, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Filter Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterChip('All Tasks', 'All'),
                        _buildFilterChip('Pending Report', 'Pending Report'),
                        _buildFilterChip('Follow-up', 'Follow-up Required'),
                        _buildFilterChip('Evidence', 'Evidence Submission'),
                        _buildFilterChip('Review', 'Review Required'),
                        _buildFilterChip('Drafts', 'Incomplete Submission'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Priority & Sorting
                  Row(
                    children: [
                      Expanded(
                        child: _buildDropdown(
                          label: 'Priority:',
                          value: _priorityFilter,
                          items: ['All', 'High', 'Medium', 'Low'],
                          onChanged: (v) => setState(() => _priorityFilter = v!),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildDropdown(
                          label: 'Sort by:',
                          value: _sortBy,
                          items: ['deadline', 'priority', 'dateNewest'],
                          labels: ['Deadline', 'Priority', 'Inspection Date'],
                          onChanged: (v) => setState(() => _sortBy = v!),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),

          // PENDING LIST SECTION
          if (filtered.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEAF7EF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check_circle_outline, size: 40, color: Color(0xFF10B981)),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No Pending Actions — You\'re all caught up.',
                      style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'All inspection reports, follow-ups, and evidence submissions are up to date.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF1F5F9),
                        foregroundColor: textDark,
                        elevation: 0,
                      ),
                      onPressed: () {
                        setState(() {
                          _activeFilter = 'All';
                          _priorityFilter = 'All';
                          _searchQuery = '';
                        });
                      },
                      child: Text('Reset Filters', style: GoogleFonts.nunito(fontWeight: FontWeight.w700)),
                    )
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => _buildActionCard(filtered[index]),
                  childCount: filtered.length,
                ),
              ),
            ),
            
          const SliverPadding(padding: EdgeInsets.only(bottom: 30)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    bool isActive = _activeFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () => setState(() => _activeFilter = value),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          height: 38,
          decoration: BoxDecoration(
            color: isActive ? chipActiveBg : chipInactiveBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isActive ? chipActiveBg : borderColor),
            boxShadow: isActive ? const [BoxShadow(color: Color(0x260B3D91), blurRadius: 4, offset: Offset(0, 2))] : null,
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isActive ? Colors.white : textMuted,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown({required String label, required String value, required List<String> items, List<String>? labels, required void Function(String?) onChanged}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      height: 42,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Text(label, style: GoogleFonts.nunito(fontSize: 12, color: textMuted)),
          const SizedBox(width: 8),
          Expanded(
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: value,
                icon: const Icon(Icons.arrow_drop_down, color: textMuted),
                style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark),
                onChanged: onChanged,
                items: items.asMap().entries.map((entry) {
                  return DropdownMenuItem(
                    value: entry.value,
                    child: Text(labels != null ? labels[entry.key] : entry.value),
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(PendingActionRecord action) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: action.urgent ? const Color(0xFFFECACA) : borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Icon(Icons.assignment_late, size: 14, color: textMuted),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      action.actionType,
                      style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w800, color: textDark),
                    ),
                  ],
                ),
                if (action.urgent)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(12)),
                    child: Row(
                      children: [
                        const Icon(Icons.warning_amber_rounded, size: 12, color: dangerRed),
                        const SizedBox(width: 4),
                        Text(
                          'URGENT',
                          style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: dangerRed),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: borderColor),
          
          // Card Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  action.name,
                  style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 14, color: textMuted),
                    const SizedBox(width: 4),
                    Text(
                      action.location,
                      style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Info Grid
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Insp. Date', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                          const SizedBox(height: 2),
                          Text(action.inspectionDate, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Deadline', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                          const SizedBox(height: 2),
                          Text(action.deadline, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w800, color: action.urgent ? dangerRed : textDark)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Action Button
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryBlue,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    onPressed: () {},
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(action.buttonText, style: GoogleFonts.nunito(fontWeight: FontWeight.w800, fontSize: 14)),
                        const SizedBox(width: 8),
                        const Icon(Icons.arrow_forward, size: 16),
                      ],
                    ),
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
