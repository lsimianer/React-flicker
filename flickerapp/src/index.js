import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './style.css'

// const clipStyle = {
//     width: '20%',
//     height: '50%',
// };




const clippings = [
    'https://www.excelsiortechnologies.com/img/about/node-js.png',
    'https://s3-eu-west-1.amazonaws.com/devinterface-web/production/technologies/30/medium/mongodb111.png?1444285573',
    'https://pngimg.com/uploads/mysql/mysql_PNG11.png',
    'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png',
    'https://i2.wp.com/www.nuimedia.com/wp-content/uploads/2017/01/javascript-logo.png?ssl=1',
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/51783668_624747524633305_1517964892651388928_n.jpg?_nc_cat=105&_nc_oc=AQlKGViN--1mlC_ir1dTjqEX86WJMSATPnFD3UIxWf82PVtcRK3qN0YHq4wj_dZwYls&_nc_ht=scontent-dfw5-2.xx&oh=e2d0d856774f9d0533991bfe105a2331&oe=5DE65C6E',
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/52402692_629682597473131_8333908735332188160_n.jpg?_nc_cat=109&_nc_oc=AQlEN7BN-niZgczry1vDz-t3cZUDM9fZSs8PiKcxjMf6_shaMSkzH5NhNohbkQekRMo&_nc_ht=scontent-dfw5-2.xx&oh=f9eeb060e366d842ac65df8c1879cb32&oe=5DA614E9',
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/66199285_715295575578499_2785559636059619328_n.jpg?_nc_cat=101&_nc_oc=AQmSPD0tXSiAqF0fK0W1OBCpqFnzCheBpaRPK7RPp-b8_qfx4DDUsPSB8Knrcmt4fms&_nc_ht=scontent-dfw5-2.xx&oh=a126fc4fdc1124f25f5982515806f58a&oe=5DE0F1FA',
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/41704052_542723766169015_500452600101994496_n.jpg?_nc_cat=107&_nc_oc=AQk5vdZa78JiMDufMiCzJeNT6-BZwHu1BZHbfcRjcWkcXDhWphwkMd8BpZ3-sPSHnaA&_nc_ht=scontent-dfw5-2.xx&oh=8d9361cc50fba786a11bfb8e1ca00ff2&oe=5DE0EC21',
    'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/54517835_643111022796955_2272656935083835392_n.jpg?_nc_cat=102&_nc_oc=AQkfagT-ZYR-87Qp8-YgFrtfCDXZDG9HZ7UhNBc5UIs6NcUETx4FrZiek_rR2dwiR9s&_nc_ht=scontent-dfw5-2.xx&oh=b1727f58a0c17eefd9ecb973ad0aef70&oe=5DA9048D',
  ]


// helpers that will be interpolated into CSS, unsure how this works, but they curate the spring data and values
const to = i => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100})
const from = i => ({ x: 0, rot: 0, scale: 1.5, y: -1000})
// this interpolates the rotation and scling into css transform property.
const trans = (r, s) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck(){
    const [gone] = useState(() => new Set()) // flags clippings flicked out
    const [props, set] = useSprings(clippings.length, i => ({ ...to(i), from: from(i) })) // create springs using the affore-established helpers
    // now to create a gesture, I want the down state
    const bind = useGesture(({ args: [index], down, delta: [xDelta], distance, direction: [xDir], velocity }) =>{
    const trigger = velocity > 0.2 // move the clipping fast enough and it'll fly
    const dir = xDir < 0 ? -1 : 1 // direction is binary, either left or right, hence constant. 
    if (!down && trigger) gone.add(index)
    set(i => {
        if(index !== i) return // only spring data for current spring
        const isGone = gone.has(index)
        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0) // card tilt amount and giving velocity of flick an affect on it
        const scale = down ? 1.1 : 1 // active clippings move up 
        return { x, rot, scale, delay: undefined, config: { friction: 50, tension: down ? 820 : isGone ? 200 : 500}}
    })
    if(!down && gone.size === clippings.length) setTimeout(() => gone.clear() || set(i => to(i)), 600)
    })
    //map out the animated values
    return props.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} style={{ transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`) }}>
            <animated.div {...bind(i)} style={{ transform: interpolate([rot, scale], trans), backgroundImage: `url(${clippings[i]})` }} />
        </animated.div>
        
        
    ))

}


render(<Deck />, document.getElementById('root'))



