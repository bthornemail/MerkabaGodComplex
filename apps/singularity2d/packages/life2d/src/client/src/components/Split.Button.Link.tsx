import { useLayoutEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function SplitButtonLink({ path, options, handleLink }: { path: string; options: string[]; handleLink: any; }) {
    // // const [showTopics, setShowTopics] = useState<boolean>(false)
    const [topic, setTopic] = useState<string>(options[0])
    const [isShown, setIsShown] = useState<boolean>(false)
    const [isToggled, setIsToggled] = useState<boolean>(false)
    const topicRef = useRef<HTMLDivElement>(null)
    const [buttonRect, setButtonRect] = useState<any>({ top: 0, left: 0 })
    const [hoverTimeout, setHoverTimeout] = useState<any>(null)
    function handleClick() {
        if (!isShown && !isToggled) {
            setIsToggled(true)
            setIsShown(true)
            return
        }
        // if (isShown && isToggled) {
            // setIsToggled(false)
            // return setIsShown(false)
        // }
        setIsToggled(false)
        setIsShown(false)
        handleLink(topic,path)
    }
    useLayoutEffect(() => {
        if (!topicRef.current) return;
        function getOffset(el: DOMRect) {
            return {
                left: el.left + window.scrollX + (el.width / 2),
                top: el.top + window.scrollY + (el.height / 2)
            };
        }
        setButtonRect(getOffset(topicRef.current?.getBoundingClientRect()))
    }, [topicRef])
    function handleMouseExit(){
            setIsToggled(false);
            const id = setInterval(() => {
                setIsShown(false)
            }, 300);
            setHoverTimeout(id)
    }
    function handleMouseEnter(){
        if (hoverTimeout) { clearInterval(hoverTimeout) } 
    }
    return <>
        <div className="split-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseExit}>
            <div className='btn btn-sm btn-light' ref={topicRef} onClick={() => { handleClick() }} >{topic}</div>
            <div className="split-button-drawer">
                {/* {isShown ? <div>{name}</div> : <></>} */}
                {options
                    .filter((option: string) => topic !== option)
                    .map((option: string, index: number) => {
                        return <div className='btn btn-sm btn-light split-button-link' onClick={() => {
                            setTopic(option)
                            setIsToggled(false)
                        }} key={index} hidden={!isShown}>{option}</div>
                    })}
            </div>
        </div>
        <style>{`
            .split-button-drawer{
                max-height: 65vh;   
                position: absolute; 
                display: flex;
                gap: 1rem;
                flex-direction: column;
                top: ${buttonRect.top};
                left: ${buttonRect.left};
            }
        `}</style>
    </>
}