import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
        const rawDate = dateString.$date || dateString;
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return "-";

        return date.toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
    } catch (e) {
        return "-";
    }
};

const prepareData = (logs) => {
    return logs.map((log, index) => ({
        No: index + 1,
        Timestamp: formatDate(log.timestamp),
        User: log.userId ? `${log.userId.prefix || ''} ${log.userId.firstname} ${log.userId.lastname}`.trim() : "Unknown User",
        Method: log.request?.method || '-',    // ✨ เพิ่ม
        Endpoint: log.request?.endpoint || '-', // ✨ เพิ่ม
        Action: log.action || '-',
        LabNumber: Array.isArray(log.labnumber) ? log.labnumber.join(', ') : (log.labnumber || '-'),
        Status: log.response?.statusCode || '-',
        Message: log.response?.message || '-',  // ✨ เพิ่ม
        TimeMs: log.response?.timeMs != null ? `${log.response.timeMs}` : '0',
    }));
};

export const exportToExcel = (logs, fileName = 'Log_Report') => {
    try {
        const data = prepareData(logs);
        const worksheet = XLSX.utils.json_to_sheet(data);

        const wscols = [
            { wch: 5 }, { wch: 20 }, { wch: 25 }, { wch: 10 },
            { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 10 },
            { wch: 40 }, { wch: 10 }
        ];
        worksheet['!cols'] = wscols;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
        XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
    } catch (error) {
        console.error("Excel Export Error:", error);
        alert("Export Excel Failed");
    }
};


export const exportToPDF = (logs, fileName = 'Log_Report') => {
    try {
        const doc = new jsPDF('l', 'mm', 'a4');
        const data = prepareData(logs);

        const tableColumn = [
            "No", "Timestamp", "User", "Method", "Endpoint",
            "Action", "Lab No.", "Status", "Message", "Time"
        ];

        const tableRows = data.map(row => [
            row.No,
            row.Timestamp,
            row.User,
            row.Method,
            row.Endpoint,
            row.Action,
            row.LabNumber,
            row.Status,
            row.Message,
            row.TimeMs
        ]);

        doc.setFontSize(14);
        doc.text("System Activity Logs Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString('en-GB')}`, 14, 22);
        doc.text(`Total Records: ${logs.length}`, 14, 27);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 32,
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [70, 134, 243], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 25 },
                2: { cellWidth: 25 },
                3: { cellWidth: 15 },
                4: { cellWidth: 35 },
                5: { cellWidth: 20 },
                6: { cellWidth: 30 },
                7: { cellWidth: 15 },
                8: { cellWidth: 'auto' },
                9: { cellWidth: 15 },
            },
            alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        doc.save(`${fileName}_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error("PDF Export Error:", error);
        alert("Export PDF Failed: " + error.message);
    }
};