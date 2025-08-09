export default function Quadrant({ entity ,children}) {
    return <div className="quadrant">
        <h2>{entity}</h2>
        {children}
    </div>;
}