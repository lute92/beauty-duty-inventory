export const generatePurchaseOrderNumber = () => {
    const prefix = 'PO';
    const currentDate = new Date();
    const datePart = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '');
    const timePart = currentDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '');
    return `${prefix}-${datePart}-${timePart}`;
}