
import { Feed } from "feed";
import { Wallet, verifyMessage } from 'ethers';
import QRCode from 'qrcode'
import { toString } from '../../life2d/components/service.board/public/modules/multiformats/src/bytes';
const marketplaceWallet = Wallet.createRandom();
const wallet = Wallet.createRandom();
const host = "127.0.0.1";
(async () => {
    try {
        const imageQrcode = await QRCode.toString(wallet.signMessageSync(marketplaceWallet.address))
        const feed = new Feed({
            title: "Feed Title",
            description: "This is my personal feed!",
            id: wallet.address,
            link: `http://${host}/${wallet}`,
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image:  imageQrcode,
            favicon: imageQrcode,
            copyright: "All rights reserved 2013, John Doe",
            updated: new Date(2013, 6, 14), // optional, default = today
            generator: "awesome", // optional, default = 'Feed for Node.js'
            feedLinks: {
                json: `http://${host}/${wallet}/json`,
                atom: `http://${host}/${wallet}/atom`
            },
            author: {
                name: wallet.address,
                email: `${wallet.address}@${host}`,
                link: `http://${host}/${wallet}/author`
            }
        });
        const posts = [
            {
                title: "Post 1",
                url: "https://example.com/post1",
                summary: "Description of Post 1",
                description: "Description of Post 1",
                content: "Content of Post 1",
                date: new Date(2024, 3, 24), // April 24, 2024
                image: "http://example.com/post1_image.png"
            },
            {
                title: "Post 2",
                url: "https://example.com/post2",
                summary: "Description of Post 1",
                description: "Description of Post 2",
                content: "Content of Post 2",
                date: new Date(2024, 3, 23), // April 23, 2024
                image: "http://example.com/post2_image.png"
            },
            {
                title: "Post 3",
                url: "https://example.com/post3",
                summary: "Description of Post 1",
                description: "Description of Post 3",
                content: "Content of Post 3",
                date: new Date(2024, 3, 22), // April 22, 2024
                image: "http://example.com/post3_image.png"
            }
        ];
        
        posts.map((post,index)=>{
            return Object.assign({},post,{
                signature: wallet.signMessageSync(JSON.stringify(post))
            });
         }).forEach(post => {
            feed.addItem({
                title: post.title,
                id: post.url,
                link: post.url,
                description: post.description,
                content: post.content,
                copyright: post.signature,
                author: [
                    {
                        name: "Jane Doe",
                        email: "janedoe@example.com",
                        link: "https://example.com/janedoe",
                    },
                    {
                        name: "Joe Smith",
                        email: "joesmith@example.com",
                        link: "https://example.com/joesmith"
                    }
                ],
                contributor: [
                    {
                        name: "Shawn Kemp",
                        email: "shawnkemp@example.com",
                        link: "https://example.com/shawnkemp"
                    },
                    {
                        name: "Reggie Miller",
                        email: "reggiemiller@example.com",
                        link: "https://example.com/reggiemiller"
                    }
                ],
                date: post.date,
                image: post.image
            });
        });
        
        feed.addCategory("Technologie");
        
        feed.addContributor({
            name: "Johan Cruyff",
            email: "johancruyff@example.com",
            link: "https://example.com/johancruyff"
        });
        
        // console.log(feed.rss2());
        // Output: RSS 2.0
        
        // console.log(feed.atom1());
        // Output: Atom 1.0
        
        console.log(feed.json1());
        console.log(feed.items);
        // Output: JSON Feed 1.0
    } catch (error) {
        console.log(error)
    }

})()