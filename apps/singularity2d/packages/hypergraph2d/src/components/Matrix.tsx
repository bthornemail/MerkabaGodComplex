// import { Children } from 'react';
import "../App.css";
export default function Matrix({ children }) {
    return (
        <div className="matrix">
            {children}
            {/*Children.map(children, child =>
                <div className="quadrant">
                    {child}
                </div>
            )*/}
        </div>
    );
}
