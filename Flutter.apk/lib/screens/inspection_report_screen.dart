import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../router/app_router.dart';

class InspectionReportRecord {
  final String id;
  final String ngoName;
  final String type;
  final String submissionDate;
  final String status;
  final String location;
  final String inspector;
  final String remarks;

  InspectionReportRecord({
    required this.id,
    required this.ngoName,
    required this.type,
    required this.submissionDate,
    required this.status,
    required this.location,
    required this.inspector,
    required this.remarks,
  });
}

class InspectionReportScreen extends StatefulWidget {
  const InspectionReportScreen({super.key});

  @override
  State<InspectionReportScreen> createState() => _InspectionReportScreenState();
}

class _InspectionReportScreenState extends State<InspectionReportScreen> {
  static const Color primaryBlue = Color(0xFF0B3D91);
  static const Color bgColor = Color(0xFFF3F4F6); // modern gray background
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  
  static const Color badgeBlue = Color(0xFFEFF6FF);
  static const Color textBlue = Color(0xFF3B82F6);
  static const Color badgeGreen = Color(0xFFECFDF5);
  static const Color textGreen = Color(0xFF10B981);
  static const Color badgeYellow = Color(0xFFFEF3C7);
  static const Color textYellow = Color(0xFFD97706);
  static const Color badgeRed = Color(0xFFFEF2F2);
  static const Color textRed = Color(0xFFDC2626);
  static const Color badgeGray = Color(0xFFF1F5F9);
  static const Color textGray = Color(0xFF475569);

  String _searchQuery = '';
  String _activeFilter = 'ALL';

  final List<InspectionReportRecord> _allReports = [
    InspectionReportRecord(
      id: 'INSP-2026-901', 
      ngoName: 'ABC Welfare Foundation', 
      type: 'Scheduled Audit', 
      submissionDate: '15 Sep 2026, 14:30', 
      status: 'Approved', 
      location: 'Kothrud, Pune', 
      inspector: 'Rajesh Kumar (PMU-10294)', 
      remarks: 'All infrastructure and beneficiary logs verified and compliant with DoSJE norms.'
    ),
    InspectionReportRecord(
      id: 'INSP-2026-902', 
      ngoName: 'Sunrise Care Institute', 
      type: 'Surprise Inspection', 
      submissionDate: '17 Sep 2026, 09:15', 
      status: 'Under Review', 
      location: 'Hadapsar, Pune', 
      inspector: 'Rajesh Kumar (PMU-10294)', 
      remarks: 'Submitted to State Coordinator for secondary verification of attendance records.'
    ),
    InspectionReportRecord(
      id: 'INSP-2026-903', 
      ngoName: 'National Rehabilitation Centre', 
      type: 'Scheduled Audit', 
      submissionDate: '12 Sep 2026, 11:45', 
      status: 'Returned for Correction', 
      location: 'Pimpri, Maharashtra', 
      inspector: 'Rajesh Kumar (PMU-10294)', 
      remarks: 'Geotagged photographs missing for kitchen facility. Re-upload required within 48 hours.'
    ),
    InspectionReportRecord(
      id: 'INSP-2026-904', 
      ngoName: 'Gramin Vikas Kendra', 
      type: 'Surprise Inspection', 
      submissionDate: '18 Sep 2026, 16:20', 
      status: 'Submitted', 
      location: 'Haveli, Pune', 
      inspector: 'Rajesh Kumar (PMU-10294)', 
      remarks: 'Report transmitted successfully to regional server. Awaiting initial queue pick.'
    ),
    InspectionReportRecord(
      id: 'INSP-2026-905', 
      ngoName: 'Hope Children Home', 
      type: 'Scheduled Audit', 
      submissionDate: 'Draft (Not Submitted)', 
      status: 'Draft', 
      location: 'Shivajinagar, Pune', 
      inspector: 'Rajesh Kumar (PMU-10294)', 
      remarks: 'Form saved offline. 3 beneficiary interviews pending submission.'
    ),
  ];

  @override
  Widget build(BuildContext context) {
    var filtered = _allReports.where((r) {
      bool matchesSearch = r.ngoName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
             r.id.toLowerCase().contains(_searchQuery.toLowerCase());
      bool matchesFilter = _activeFilter == 'ALL' || r.status == _activeFilter;
      return matchesSearch && matchesFilter;
    }).toList();

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
          'Inspection Reports',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textDark,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: textDark, size: 22),
            onPressed: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // PAGE HEADING
                  Text(
                    'Submitted Reports & Tracking',
                    style: GoogleFonts.nunito(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: primaryBlue,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Track processing stages, reviewer remarks, and correction flags for your filed reports.',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: textMuted,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SEARCH AND FILTER BAR
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: GoogleFonts.nunito(fontSize: 15, color: textDark, fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      hintText: 'Search by institution or ID...',
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
                  const SizedBox(height: 12),
                  
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    height: 48,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: borderColor),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        isExpanded: true,
                        value: _activeFilter,
                        icon: const Icon(Icons.arrow_drop_down, color: textMuted),
                        style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700, color: textDark),
                        onChanged: (String? newValue) {
                          if (newValue != null) setState(() => _activeFilter = newValue);
                        },
                        items: const [
                          DropdownMenuItem(value: 'ALL', child: Text('All Statuses')),
                          DropdownMenuItem(value: 'Draft', child: Text('Draft Reports')),
                          DropdownMenuItem(value: 'Submitted', child: Text('Submitted Reports')),
                          DropdownMenuItem(value: 'Under Review', child: Text('Under Review')),
                          DropdownMenuItem(value: 'Approved', child: Text('Approved')),
                          DropdownMenuItem(value: 'Returned for Correction', child: Text('Returned for Correction')),
                          DropdownMenuItem(value: 'Follow-up Required', child: Text('Follow-up Reports')),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // REPORTS LIST HEADER
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Report Records',
                        style: GoogleFonts.nunito(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: textDark,
                        ),
                      ),
                      Text(
                        'Showing ${filtered.length} reports',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // REPORTS LIST
          if (filtered.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.description_outlined, size: 48, color: textMuted),
                    const SizedBox(height: 16),
                    Text(
                      'No reports found',
                      style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: textDark),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Try modifying your search or filters.',
                      style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => _buildReportCard(filtered[index]),
                  childCount: filtered.length,
                ),
              ),
            ),
            
          const SliverPadding(padding: EdgeInsets.only(bottom: 30)),
        ],
      ),
    );
  }

  Widget _buildReportCard(InspectionReportRecord record) {
    Color badgeColor = badgeGray;
    Color textColor = textGray;
    
    if (record.status == 'Approved') { badgeColor = badgeGreen; textColor = textGreen; }
    else if (record.status == 'Under Review' || record.status == 'Submitted') { badgeColor = badgeBlue; textColor = textBlue; }
    else if (record.status == 'Returned for Correction' || record.status == 'Follow-up Required') { badgeColor = badgeRed; textColor = textRed; }
    else if (record.status == 'Draft') { badgeColor = badgeYellow; textColor = textYellow; }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 6, offset: Offset(0, 3))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  record.id,
                  style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: textMuted),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: badgeColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    record.status,
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: textColor,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: borderColor),
          
          // Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  record.ngoName,
                  style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark),
                ),
                const SizedBox(height: 12),
                
                // Info
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Type', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                          const SizedBox(height: 2),
                          Text(record.type, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Date', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                          const SizedBox(height: 2),
                          Text(record.submissionDate, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Remarks Block
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.info_outline, size: 16, color: textColor),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          record.remarks,
                          style: GoogleFonts.nunito(fontSize: 13, color: textDark, height: 1.4),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                
                // Actions
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {},
                      style: TextButton.styleFrom(
                        foregroundColor: textMuted,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      child: Text('View Details', style: GoogleFonts.nunito(fontWeight: FontWeight.w700)),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton.icon(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryBlue,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      icon: const Icon(Icons.file_download, size: 18),
                      label: Text('Download Report', style: GoogleFonts.nunito(fontWeight: FontWeight.w800, fontSize: 13)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
