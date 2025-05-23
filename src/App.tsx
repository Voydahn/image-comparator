import './App.css'
import ImageComparator from "@/img-comparator/ReactCompareImage.tsx";

function App() {

    return (
        <div className={"h-screen"}>
            <h1>Image Comparator</h1>

            <ImageComparator padding={{
                left: 0,
                right: 0
            }} />
        </div>
    );
}

export default App
