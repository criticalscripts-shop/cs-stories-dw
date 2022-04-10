process.env.NODE_ENV = 'production'

;(() => {
    on('cs-stories:ready', (resourceName, external) => {
        if (!config.discordWebhookUrl)
            return

        let path = null
        let fs = null
        let globalViewKey = null

        if (!external) {
            path = `${GetResourcePath(resourceName)}/storage/videos`
            fs = require('fs')
        } else
            (require('crypto')).createHash('sha256').update(external.key).digest('hex')

        const request = require('request')

        on('cs-stories:upload', entry => {
            request.post({
                url: config.discordWebhookUrl,

                formData: {
                    file: external ? null : fs.createReadStream(`${path}/${entry.uuid}.webm`),

                    payload_json: JSON.stringify({
                        content: `A new story has been uploaded!${external ? ` ${external.url}video/${globalViewKey}/${entry.uuid}.webm` : ''}`,

                        username: 'cs-stories',
                        avatar_url: 'https://files.criticalscripts.shop/brand-assets/favicon.png',

                        embeds: [
                            {
                                type: 'rich',
                                title: 'Story Data',
                                description: `UUID \`${entry.uuid}\``,
                                color: 0xff0037,

                                fields: [
                                    {
                                        name: 'Author',
                                        value: `_${entry.author}_ (\`${entry.license}\`)`,
                                        inline: false
                                    },

                                    {
                                        name: 'Location',
                                        value: `_${entry.location.x.toFixed(8)}, ${entry.location.y.toFixed(8)}, ${entry.location.z.toFixed(8)}_`,
                                        inline: false
                                    }
                                ],

                                footer: {
                                    text: 'Critical Scripts',
                                    icon_url: 'https://files.criticalscripts.shop/brand-assets/favicon.png'
                                }
                            }
                        ]
                    })
                }
            }, (error, response, body) => {
                if (error)
                    console.error(`[cs-stories-dw] Failed to post Discord webhook!`, error)
            })
        })
    })

    emit('cs-stories-dw:ready')
}) ();
