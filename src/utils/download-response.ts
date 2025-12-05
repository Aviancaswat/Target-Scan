import htmlToPdfmake from "html-to-pdfmake";
import { marked } from "marked";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export const downloadFileMdToPdf = async (markdown: string, filename = "target-scan.pdf") => {
    const html = await marked.parse(markdown);

    const content = htmlToPdfmake(html, {
        defaultStyles: {
            h1: { fontSize: 24, bold: true, marginBottom: 8 },
            h2: { fontSize: 22, bold: true, marginBottom: 7 },
            h3: { fontSize: 20, bold: true, marginBottom: 6 },
            h4: { fontSize: 18, bold: true, marginBottom: 5 },
            h5: { fontSize: 16, bold: true, marginBottom: 4 },
            h6: { fontSize: 14, bold: true, marginBottom: 3 },
            p: { margin: [0, 4, 0, 8], fontSize: 12 },
            ul: { marginBottom: 6, marginLeft: 10 },
            ol: { marginBottom: 6, marginLeft: 10 },
            li: { marginBottom: 2, fontSize: 12 },
            code: {
                fontSize: 10,
                background: '#f0f0f0',
                color: '#d63384',
                margin: [4, 2, 4, 2],
                preserveLeadingSpaces: true,
                lineHeight: 1.2,
            },
            pre: {
                fontSize: 10,
                background: '#f7f7f7',
                color: '#333333',
                margin: [0, 6, 0, 6],
                preserveLeadingSpaces: true,
                lineHeight: 1.2
            },
            a: { color: "blue", decoration: "underline" },
            table: { marginBottom: 6 },
            th: { bold: true, fillColor: "#eeeeee" },
            td: { margin: [0, 2, 0, 2] },
        },
        tableAutoSize: false,
        imagesByReference: false,
        removeExtraBlanks: false,
        ignoreStyles: []
    });

    const docDefinition: any = {
        content: content,
        defaultStyle: {
            fontSize: 12,
        },
        styles: {
            "html-pre": { margin: [0, 6, 0, 6] },
        }
    };

    pdfMake.createPdf(docDefinition).download(filename)
};