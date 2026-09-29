import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

class VaultGalleryView extends StatefulWidget {
  const VaultGalleryView({super.key});

  @override
  State<VaultGalleryView> createState() => _VaultGalleryViewState();
}

class _VaultGalleryViewState extends State<VaultGalleryView> {
  static const channel = MethodChannel('com.inspex.inspec1dart/geotag');
  List<String> _imageNames = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadImages();
  }

  Future<void> _loadImages() async {
    try {
      final List<dynamic> result = await channel.invokeMethod('getVaultImages');
      setState(() {
        _imageNames = result.cast<String>();
        _isLoading = false;
      });
    } on PlatformException catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading images: ${e.message}')),
        );
      }
    }
  }

  Future<Uint8List?> _getDecryptedImage(String fileName) async {
    try {
      final Uint8List? bytes = await channel.invokeMethod('getDecryptedImage', {'fileName': fileName});
      return bytes;
    } on PlatformException catch (e) {
      debugPrint('Error decrypting image: $e');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Image Vault',
          style: GoogleFonts.nunito(
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        backgroundColor: const Color(0xFF0B3D91),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      backgroundColor: const Color(0xFFF5F7FA),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF0D9488)))
          : _imageNames.isEmpty
              ? Center(
                  child: Text(
                    'Vault is empty.',
                    style: GoogleFonts.nunito(color: Colors.black54, fontSize: 16),
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _imageNames.length,
                  itemBuilder: (context, index) {
                    final fileName = _imageNames[index];
                    return FutureBuilder<Uint8List?>(
                      future: _getDecryptedImage(fileName),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return Container(
                            height: 200,
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x140B3D91),
                                  blurRadius: 20,
                                  offset: Offset(0, 6),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: CircularProgressIndicator(color: Color(0xFF0D9488)),
                            ),
                          );
                        } else if (snapshot.hasError || !snapshot.hasData) {
                          return Container(
                            height: 200,
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x140B3D91),
                                  blurRadius: 20,
                                  offset: Offset(0, 6),
                                ),
                              ],
                            ),
                            child: const Center(
                              child: Icon(Icons.error, color: Colors.red),
                            ),
                          );
                        } else {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(16),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x140B3D91),
                                  blurRadius: 20,
                                  offset: Offset(0, 6),
                                ),
                              ],
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: Image.memory(
                                snapshot.data!,
                                fit: BoxFit.cover,
                                width: double.infinity,
                              ),
                            ),
                          );
                        }
                      },
                    );
                  },
                ),
    );
  }
}
