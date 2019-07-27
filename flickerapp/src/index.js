import { render } from 'react-dom'
import React, { useState } from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import './style.css'

const clippings = [
'./images/britain.jpg',
'./images/glenn.jpg',
'./images/marketL.jpg',
'./images/singapore.jpg',
'./images/ww2over.jpg',
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



