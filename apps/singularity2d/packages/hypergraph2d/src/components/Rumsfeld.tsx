import Quadrant from "./Quadrant";

export default function RumsfeldMatrices() {
    return <div className="rumsfeld matrices">
        <Quadrant matrix="kk" />
        <Quadrant matrix="ku" />
        <Quadrant matrix="uk" />
        <Quadrant matrix="uu" />
    </div>;
}