/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Feed, Item } from "feed";

export default function FeedElement() {
    const [feed, setFeed] = useState<any>()

    useEffect(() => {
        const feed = new Feed({
            title: "Feed Title",
            description: "This is my personal feed!",
            id: "http://example.com/",
            link: "http://example.com/",
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://example.com/image.png",
            favicon: "http://example.com/favicon.ico",
            copyright: "All rights reserved 2013, John Doe",
            updated: new Date(2013, 6, 14), // optional, default = today
            generator: "awesome", // optional, default = 'Feed for Node.js'
            feedLinks: {
                json: "https://example.com/json",
                atom: "https://example.com/atom"
            },
            author: {
                name: "John Doe",
                email: "johndoe@example.com",
                link: "https://example.com/johndoe"
            }
        });
        const posts = [
            {
                title: "Post 1",
                url: "https://example.com/post1",
                description: "Description of Post 1",
                content: "Content of Post 1",
                date: new Date(2024, 3, 24), // April 24, 2024
                image: "http://example.com/post1_image.png"
            },
            {
                title: "Post 2",
                url: "https://example.com/post2",
                description: "Description of Post 2",
                content: "Content of Post 2",
                date: new Date(2024, 3, 23), // April 23, 2024
                image: "http://example.com/post2_image.png"
            },
            {
                title: "Post 3",
                url: "https://example.com/post3",
                description: "Description of Post 3",
                content: "Content of Post 3",
                date: new Date(2024, 3, 22), // April 22, 2024
                image: "http://example.com/post3_image.png"
            }
        ];

        posts.forEach((post) => {
            feed.addItem({
                title: post.title,
                id: post.url,
                link: post.url,
                description: post.description,
                content: post.content,
                author: [
                    {
                        name: "Jane Doe",
                        email: "janedoe@example.com",
                        link: "https://example.com/janedoe"
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
        // // Output: RSS 2.0

        // console.log(feed.atom1());
        // // Output: Atom 1.0

        // console.log(feed.json1());
        // Output: JSON Feed 1.0
        console.log(JSON.parse(feed.json1()));
        setFeed(JSON.parse(feed.json1()))
    }, [])
    const {
        // version,
        title,
        home_page_url,
        feed_url,
        description,
        icon,
        author,
        // items
    } = feed ? feed : {
        // version:"",
        title:"",
        home_page_url:"",
        feed_url:"",
        description:"",
        icon:"",
        author:{name:"",url:""},
        // items
    }
    return (
        <div className="feed">
            <div className="card">
                <p className='feed-author'>{title}</p>
                <p className='feed-author'>{home_page_url}</p>
                <p className='feed-author'>{feed_url}</p>
                <p className='feed-author'>{description}</p>
                <p className='feed-author'>{icon}</p>
                {/* <p className='feed-author'>{author ?? author.name}</p> */}
                {/* <p className='feed-author'>{author ?? author.url}</p> */}
                {/* <p className='feed-author'>{items}</p> */}
            </div>
            {feed?.items.map((item, index) => { return <FeedItem key={index} item={item} /> })}
        </div>)
}

export function FeedItem({ item }: { item: Item }) {
    const {
        title,
        id,
        link,
        description,
        content,
        author,
        contributor,
        date,
        image
    } = item;
    return (<div className='card'>
        <p className='feed-author'>{title}</p>
        <p className='feed-author'>{id}</p>
        <p className='feed-author'>{link}</p>
        <p className='feed-author'>{description}</p>
        <p className='feed-author'>{content}</p>
        <div className="card">
            Authors
            {author && author.length > 0 ? author?.map((item, index) => {
                return <div key={index}>
                    <p className='feed-author'>{item.name}</p>
                    <p className='feed-author'>{item.email}</p>
                    <p className='feed-author'>{item.link}</p>
                </div>
            }) : <></>}
        </div>
        {/*<div className="card">
        Contributors
            {typeof contributor === 'string' 
            ? <p className='feed-author'>{contributor}</p>
            : contributor?.map((item, index) => {
                return <div key={index}>
                    <p className='feed-author'>{item.name}</p>
                    <p className='feed-author'>{item.email}</p>
                    <p className='feed-author'>{item.link}</p>
                </div>
            })}
        </div> */}
        {/* {typeof date === 'string' 
        ? <p className='feed-author'>{date}</p>
            : <input className='feed-author' type="datetime-local" defaultValue={date.toISOString().slice(0, 16)} />} */}
        <p className='feed-author'>{image?.toString()}</p>
    </div>)
}