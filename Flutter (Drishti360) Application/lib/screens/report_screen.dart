import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:screenshot/screenshot.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import '../router/app_router.dart';

const Color primaryBlue = Color(0xFF09377A);
const Color bgColor = Color(0xFFF4F7FB);
const Color textDark = Color(0xFF0F172A);
const Color textMuted = Color(0xFF64748B);
const Color borderColor = Color(0xFFE2E8F0);
const Color success = Color(0xFF16A34A);
const Color danger = Color(0xFFDC2626);
const Color warning = Color(0xFFEA580C);

class ReportScreen extends StatefulWidget {
  const ReportScreen({super.key});
  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  
  final ScreenshotController _sc1 = ScreenshotController();
  final ScreenshotController _sc2 = ScreenshotController();
  final ScreenshotController _sc3 = ScreenshotController();

  bool _isDownloading = false;

  Future<void> _downloadPDF() async {
    setState(() => _isDownloading = true);
    try {
      var manageStatus = await Permission.manageExternalStorage.status;
      if (!manageStatus.isGranted) {
        await Permission.manageExternalStorage.request();
      }

      final image1 = await _sc1.capture(delay: const Duration(milliseconds: 100));
      final image2 = await _sc2.capture(delay: const Duration(milliseconds: 100));
      final image3 = await _sc3.capture(delay: const Duration(milliseconds: 100));
      
      if (image1 == null || image2 == null || image3 == null) throw Exception('Screenshot failed');

      final pdf = pw.Document();
      for (var img in [image1, image2, image3]) {
        final pdfImage = pw.MemoryImage(img);
        pdf.addPage(
          pw.Page(
            margin: const pw.EdgeInsets.all(10),
            pageFormat: PdfPageFormat.a4,
            build: (pw.Context context) {
              return pw.Center(child: pw.Image(pdfImage, fit: pw.BoxFit.contain));
            },
          ),
        );
      }

      String filePath = '';
      try {
        final downloadDir = Directory('/storage/emulated/0/Download');
        if (!downloadDir.existsSync()) downloadDir.createSync(recursive: true);
        filePath = '${downloadDir.path}/Inspex_Report_${DateTime.now().millisecondsSinceEpoch}.pdf';
        File(filePath).writeAsBytesSync(await pdf.save());
      } catch (e1) {
        try {
          final extDir = await getExternalStorageDirectory();
          if (extDir != null) {
            filePath = '${extDir.path}/Inspex_Report_${DateTime.now().millisecondsSinceEpoch}.pdf';
            File(filePath).writeAsBytesSync(await pdf.save());
          } else {
            throw Exception('extDir is null');
          }
        } catch (e2) {
          final appDir = await getApplicationDocumentsDirectory();
          filePath = '${appDir.path}/Inspex_Report_${DateTime.now().millisecondsSinceEpoch}.pdf';
          File(filePath).writeAsBytesSync(await pdf.save());
        }
      }
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Saved: $filePath'), duration: const Duration(seconds: 5)));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed: $e')));
      }
    } finally {
      if (mounted) setState(() => _isDownloading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primaryBlue,
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
        title: Text('Final Report', style: GoogleFonts.nunito(fontSize: 19, fontWeight: FontWeight.w700, color: Colors.white)),
        actions: [
          if (_isDownloading)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0),
              child: Center(child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))),
            )
          else
            IconButton(
              icon: const Icon(Icons.file_download, color: Colors.white),
              onPressed: _downloadPDF,
            ),
        ],
      ),
            body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            children: [
              Screenshot(controller: _sc1, child: Container(color: Colors.white, child: _page1())),
              Screenshot(controller: _sc2, child: Container(color: Colors.white, child: _page2())),
              Screenshot(controller: _sc3, child: Container(color: Colors.white, child: _page3())),
            ],
          ),
        ),
      ),
    );
  }

  
  Widget _page1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        // 1. Report Header
        Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: primaryBlue, width: 4))),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.network(
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png',
                    width: 50,
                    errorBuilder: (ctx, err, stack) => const Icon(Icons.account_balance, size: 50, color: primaryBlue),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text('Government of India', style: GoogleFonts.merriweather(fontSize: 18, fontWeight: FontWeight.bold, color: primaryBlue)),
                      Text('Dept. of Social Justice & Empowerment', style: GoogleFonts.nunito(fontSize: 12, color: textDark)),
                    ],
                  )
                ],
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 6),
                color: primaryBlue,
                child: Text('SYSTEM-GENERATED REPORT', textAlign: TextAlign.center, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: 1)),
              ),
              const SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                childAspectRatio: 3.5,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildMeta('Report ID:', 'RPT-20260921-8842'),
                  _buildMeta('Inspection ID:', 'INS-20260920-045'),
                  _buildMeta('Generated:', '21 Sept 2026, 10:30 AM'),
                  _buildMetaBadge('Status:', 'Finalized', success),
                ],
              )
            ],
          ),
        ),

        // 2. Institution Details
        _buildSectionHeader(Icons.account_balance, '2. Institution Details'),
        _buildDataGrid([
          ['NGO / Institution Name', 'ABCD Welfare Institute'],
          ['Institution ID & Type', 'NGO-MH-2018-0992 • Senior Care Home'],
          ['Contact Person & Number', 'Mr. Anil Sharma (+91 98765 43210)'],
          ['Full Address', '12, Welfare Campus, Karad Road, Satara, Maharashtra - 415110'],
        ]),

        // 3. Inspection Team
        _buildSectionHeader(Icons.group, '3. Inspection Team'),
        _buildDataGrid([['Team Name / ID', 'PMU Team Alpha (TM-A-04)']]),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(border: Border.all(color: borderColor)),
          child: Table(
            border: TableBorder.symmetric(inside: const BorderSide(color: borderColor)),
            children: [
              TableRow(decoration: const BoxDecoration(color: Color(0xFFF1F5F9)), children: [_th('Name'), _th('Officer ID'), _th('Role')]),
              TableRow(children: [_td('Rajesh Kumar'), _td('PMU-INS-10294'), _td('Lead Inspector')]),
              TableRow(children: [_td('Amit Patel'), _td('PMU-INS-10305'), _td('Field Assessor')]),
            ],
          ),
        ),

      ],
    );
  }

  Widget _page2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
// 4. Location Verification
        _buildSectionHeader(Icons.location_on, '4. Location Verification'),
        _buildDataGrid([
          ['GPS Coordinates', '17.2833Â° N, 74.1833Â° E (Verified)'],
          ['Inspection Time', '20 Sept 2026 • 11:00 AM to 02:30 PM'],
        ]),

        // 5. Checklist Results (with Table)
        _buildSectionHeader(Icons.fact_check, '5. Checklist Results'),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(border: Border.all(color: borderColor), borderRadius: BorderRadius.circular(8)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Infrastructure & Facilities', style: GoogleFonts.nunito(fontWeight: FontWeight.bold, fontSize: 13, color: textDark)),
                  Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), decoration: BoxDecoration(color: success.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)), child: Text('87.5% Complete', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.bold, color: success))),
                ],
              ),
              const SizedBox(height: 8),
              Table(
                border: TableBorder(horizontalInside: BorderSide(color: borderColor.withValues(alpha: 0.5))),
                children: [
                  TableRow(children: [_th('Item'), _th('Status'), _th('Remarks')]),
                  TableRow(children: [_td('Building condition'), _tdBadge('Completed', success), _td('Well maintained.')]),
                  TableRow(children: [_td('Fire safety equip.'), _tdBadge('Not Completed', danger), _td('Extinguishers expired.')]),
                  TableRow(children: [_td('Drinking water'), _tdBadge('Completed', success), _td('RO functional.')]),
                ],
              ),
            ],
          ),
        ),

        // 6. Inspection Summary (with Pie Chart)
        _buildSectionHeader(Icons.pie_chart, '6. Inspection Summary'),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          child: Wrap(
            spacing: 8, runSpacing: 8,
            children: [
              _summaryBox('90.4%', 'Overall Completion', primaryBlue),
              _summaryBox('38', 'Completed Items', success),
              _summaryBox('3', 'Not Completed', danger),
              _summaryBox('12', 'Observations', textDark),
              _summaryBox('2', 'Irregularities', danger),
              _summaryBox('18', 'Evidence Files', textDark),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 120,
          child: PieChart(
            PieChartData(
              sections: [
                PieChartSectionData(value: 38, color: success, title: '', radius: 25),
                PieChartSectionData(value: 3, color: danger, title: '', radius: 25),
              ],
              centerSpaceRadius: 35,
            ),
          ),
        ),

              ],
    );
  }


  Widget _page3() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
// 7. Risk Assessment (with Radar Chart)
        _buildSectionHeader(Icons.warning, '7. Risk Assessment'),
        Center(
          child: Column(
            children: [
              Text('42 / 100', style: GoogleFonts.nunito(fontSize: 22, fontWeight: FontWeight.bold, color: warning)),
              Text('Moderate Risk', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.bold, color: warning)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 150,
          child: RadarChart(
            RadarChartData(
              dataSets: [
                RadarDataSet(
                  fillColor: warning.withValues(alpha: 0.2),
                  borderColor: warning,
                  entryRadius: 2,
                  dataEntries: [
                    const RadarEntry(value: 35),
                    const RadarEntry(value: 60),
                    const RadarEntry(value: 20),
                    const RadarEntry(value: 50),
                    const RadarEntry(value: 45),
                  ],
                )
              ],
              radarBackgroundColor: Colors.transparent,
              borderData: FlBorderData(show: false),
              radarBorderData: const BorderSide(color: Colors.transparent),
              getTitle: (index, angle) {
                final labels = ['Infra', 'Compliance', 'Staff', 'Safety', 'Docs'];
                return RadarChartTitle(text: labels[index], positionPercentageOffset: 0.1);
              },
              tickCount: 1,
              ticksTextStyle: const TextStyle(color: Colors.transparent),
            ),
          ),
        ),

        // 8. AI-Generated Summary
        _buildSectionHeader(Icons.smart_toy, '8. AI-Generated Summary'),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text('AI-assisted analysis based on inspection data.', style: GoogleFonts.nunito(fontSize: 11, fontStyle: FontStyle.italic, color: textMuted)),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(8)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Key Findings', style: GoogleFonts.nunito(fontWeight: FontWeight.bold, fontSize: 13, color: textDark)),
              const SizedBox(height: 4),
              _bullet('Excellent standard of hygiene and drinking water facilities.'),
              _bullet('Critical: Fire safety equipment is outdated and requires immediate replacement.', isBold: true),
              _bullet('Renewal of specific NGO compliance certificates pending.'),
              const SizedBox(height: 12),
              Text('Recommended Actions', style: GoogleFonts.nunito(fontWeight: FontWeight.bold, fontSize: 13, color: textDark)),
              const SizedBox(height: 4),
              _bullet('Procure and install updated fire extinguishers within 48 hours.'),
              _bullet('Submit renewed fire-safety NOC to the PMU portal.'),
              _bullet('Targeted virtual follow-up recommended in 15 days.'),
            ],
          ),
        ),

        // 9. Final Assessment
        _buildSectionHeader(Icons.edit_document, '9. Final Assessment'),
        _buildDataGrid([
          ['Inspection Team Remarks', 'The institution is generally functioning well and fulfilling its mandate. However, the administration has been warned regarding the lapse in fire safety equipment.'],
          ['Overall Assessment', 'Satisfactory with Conditions'],
          ['Follow-up Required?', 'Yes (Medium Priority) • 05 Oct 2026'],
        ]),

        // Signatures
        const SizedBox(height: 24),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildSignature('Rajesh Kumar', 'Lead Officer'),
              _buildSignature('Anil Sharma', 'Inst. Head'),
            ],
          ),
        ),

        // Footer
        Container(
          margin: const EdgeInsets.only(top: 20),
          padding: const EdgeInsets.all(12),
          child: Center(
            child: Text('System Generated Document • DoSJE, Govt. of India', style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
          ),
        ),
      ],
    );
  }

  Widget _bullet(String text, {bool isBold = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('• ', style: TextStyle(fontSize: 14)),
          Expanded(child: Text(text, style: GoogleFonts.nunito(fontSize: 12, fontWeight: isBold ? FontWeight.bold : FontWeight.normal, color: textDark))),
        ],
      ),
    );
  }

  Widget _summaryBox(String val, String lbl, Color color) {
    return Container(
      width: 100,
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(border: Border.all(color: borderColor), borderRadius: BorderRadius.circular(6)),
      child: Column(
        children: [
          Text(val, style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
          const SizedBox(height: 2),
          Text(lbl, textAlign: TextAlign.center, style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
        ],
      ),
    );
  }

  Widget _buildMeta(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
        Text(value, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.bold, color: textDark)),
      ],
    );
  }

  Widget _buildMetaBadge(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
          child: Text(value, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(IconData icon, String title) {
    return Container(
      margin: const EdgeInsets.only(top: 16, bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      color: const Color(0xFFF8FAFC),
      child: Row(
        children: [
          Icon(icon, size: 14, color: primaryBlue),
          const SizedBox(width: 8),
          Text(title, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.bold, color: primaryBlue)),
        ],
      ),
    );
  }

  Widget _buildDataGrid(List<List<String>> data) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Wrap(
        spacing: 16,
        runSpacing: 12,
        children: data.map((item) {
          return SizedBox(
            width: 140,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item[0], style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
                const SizedBox(height: 2),
                Text(item[1], style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: textDark)),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _th(String text) {
    return Padding(padding: const EdgeInsets.all(6.0), child: Text(text, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.bold, color: textMuted)));
  }

  Widget _td(String text) {
    return Padding(padding: const EdgeInsets.all(6.0), child: Text(text, style: GoogleFonts.nunito(fontSize: 11, color: textDark)));
  }

  Widget _tdBadge(String text, Color color) {
    return Padding(
      padding: const EdgeInsets.all(6.0),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
          child: Text(text, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
        ),
      ),
    );
  }

  Widget _buildSignature(String name, String role) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 30,
          decoration: const BoxDecoration(border: Border(bottom: BorderSide(color: borderColor))),
          child: Center(child: Text('Signed', style: GoogleFonts.caveat(fontSize: 18, color: primaryBlue))),
        ),
        const SizedBox(height: 4),
        Text(name, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.bold, color: textDark)),
        Text(role, style: GoogleFonts.nunito(fontSize: 9, color: textMuted)),
      ],
    );
  }
}
