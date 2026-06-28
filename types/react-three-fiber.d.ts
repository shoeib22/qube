import { ThreeElements } from '@react-three/fiber'

declare global {
    namespace React {
        namespace JSX {
            // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- interface merging required to augment React's JSX namespace with r3f elements
        interface IntrinsicElements extends ThreeElements { }
        }
    }
}
