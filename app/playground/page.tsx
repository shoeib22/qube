import PhysicsWorld from "../../components/3d/PhysicsWorld";
import Header from "../../components/Header";

export default function PlaygroundPage() {
    return (
        <main className="w-full h-screen overflow-hidden">
            <Header />
            <PhysicsWorld />
        </main>
    );
}
