import os
import sys

def convert_pptx_to_pdf(powerpoint_path, pdf_path):
    # Try PowerPoint COM interface on Windows
    try:
        import comtypes.client
        print("Attempting PPTX to PDF conversion using comtypes and MS PowerPoint...")
        
        # Initialize PowerPoint
        powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
        powerpoint.Visible = 1
        
        # Open the presentation
        abs_powerpoint_path = os.path.abspath(powerpoint_path)
        abs_pdf_path = os.path.abspath(pdf_path)
        
        presentation = powerpoint.Presentations.Open(abs_powerpoint_path)
        
        # Save as PDF (Format value 32 is for PDF)
        presentation.SaveAs(abs_pdf_path, 32)
        presentation.Close()
        powerpoint.Quit()
        print(f"Successfully converted {powerpoint_path} to {pdf_path} using MS PowerPoint COM interface.")
        return True
    except Exception as e:
        print(f"PowerPoint COM automation failed: {e}")
        
    # Try LibreOffice if on path
    try:
        import subprocess
        print("Attempting conversion using LibreOffice...")
        # on Windows, check default soffice path or system PATH
        soffice_paths = [
            "soffice",
            r"C:\Program Files\LibreOffice\program\soffice.exe",
            r"C:\Program Files (x86)\LibreOffice\program\soffice.exe"
        ]
        
        converted = False
        for path in soffice_paths:
            try:
                # Command: soffice --headless --convert-to pdf --outdir <dir> <file>
                outdir = os.path.dirname(os.path.abspath(pdf_path))
                file_path = os.path.abspath(powerpoint_path)
                result = subprocess.run([path, "--headless", "--convert-to", "pdf", "--outdir", outdir, file_path], 
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                print(f"LibreOffice command output: {result.stdout.decode('utf-8', errors='ignore')}")
                
                # LibreOffice creates a file with the same name but .pdf extension in the outdir
                expected_output = os.path.join(outdir, os.path.splitext(os.path.basename(powerpoint_path))[0] + ".pdf")
                if os.path.exists(expected_output):
                    if expected_output != os.path.abspath(pdf_path):
                        if os.path.exists(pdf_path):
                            os.remove(pdf_path)
                        os.rename(expected_output, pdf_path)
                    print(f"Successfully converted {powerpoint_path} to {pdf_path} using LibreOffice.")
                    converted = True
                    break
            except Exception as ex:
                continue
        if converted:
            return True
    except Exception as e:
        print(f"LibreOffice conversion failed: {e}")
        
    print("\n[NOTE] Automated conversion to PDF was not successful because neither MS PowerPoint nor LibreOffice command-line tool could be automated in this environment.")
    print("You can easily convert it yourself by opening the generated PPTX file in Microsoft PowerPoint, Google Slides, or LibreOffice and saving/exporting it as PDF.")
    return False

if __name__ == '__main__':
    pptx_file = 'Kloudera_CII_Pitch_Deck_2026.pptx'
    pdf_file = 'Kloudera_CII_Pitch_Deck_2026.pdf'
    convert_pptx_to_pdf(pptx_file, pdf_file)
