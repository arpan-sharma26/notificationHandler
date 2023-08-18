const axios = require('axios').default;

const ReadStreamAsync = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => resolve(body))
        req.on('error', (e) => reject(e))
    })
}

const HandleSNSNotification = async (req, res, next) => {
    try {
        const data = await ReadStreamAsync(req);
        if (!data) return res.end('OK')
        const response = JSON.parse(data);
        switch (response.Type) {
            case 'SubscriptionConfirmation':
                await axios.get(response.SubscribeURL);
                break;
            case 'Notification':
                const message = JSON.parse(response.Message)
                let { source } = message.mail;
                source = source.match(/(?:<)?(.+@.+)(?:>)?/)[1];
                const { companyId, domainId } = req.params;
                const slug = (source.split('@')[1]).split('.')[0];
                let query = (companyId && domainId) ? { _id: ObjectId(companyId) } : { 'CMS.ProjectSlug': slug }
                const mdb = global.dbs['TP_Master'];
                const company = await mdb.collection('Company').findOne(query);
                if (!company) return res.end('OK');
                let website = company.CMS.find(c => { return (domainId) ? (c._id.toString() == domainId) : c.ProjectSlug == slug })
                if (!website) return res.end('OK')
                await CompanyDBConnection(company.DBName, company.DBAddress);
                const db = global.dbs[company.DBName]
                const collection = db.collection('EmailLogs_' + (website.ProjectSlug.replace(/-/g, '_')));

            //     switch (message.notificationType) {
            //         case 'Delivery':
            //             HandleDeliveryNotification(collection, message)
            //             break;
            //         case 'Bounce':
            //             HandleBounceNotification(collection, message)
            //             break;
            //         case 'Complaint':
            //             HandleComplaintNotification(collection, message)
            //             break;
            //         default:
            //             console.log('Unhandled Notification Type: ', message.notificationType);
            //             break;
            //     }
            //     break;
            // default:
            //     console.log('Unhandled Type: ', response.Type);
            //     break;
        }
        res.end('OK')
    } catch (error) {
        console.log(error);
        res.end('OK')
    }
}

module.exports = {HandleSNSNotification};