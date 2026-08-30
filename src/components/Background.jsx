import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	useEffect(() => {
		let currentScroll = 0
		let requestId

		const handleScroll = () => {
			const newScroll = window.pageYOffset
			currentScroll = newScroll

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return
				const initialPos = initialPositions[index]
				const xOffset = Math.sin(newScroll / 120 + index * 0.5) * 220
				const yOffset = Math.cos(newScroll / 120 + index * 0.5) * 30

				const x = initialPos.x + xOffset
				const y = initialPos.y + yOffset

				blob.style.transform = `translate(${x}px, ${y}px)`
				blob.style.transition = "transform 1.6s ease-out"
			})

			requestId = requestAnimationFrame(handleScroll)
		}

		window.addEventListener("scroll", handleScroll)
		return () => {
			window.removeEventListener("scroll", handleScroll)
			cancelAnimationFrame(requestId)
		}
	}, [])

	return (
		<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030305]">
			{/* Subtle Luxury Monochrome Glow Orbs */}
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-[-10%] left-[-5%] md:w-[650px] md:h-[650px] w-80 h-80 bg-gradient-to-br from-zinc-700/10 to-transparent rounded-full blur-[140px] opacity-40"
				/>
				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-zinc-600/10 to-transparent rounded-full blur-[150px] opacity-35 hidden sm:block"
				/>
				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-zinc-800/15 to-transparent rounded-full blur-[160px] opacity-30"
				/>
				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute top-[60%] right-[15%] w-[550px] h-[550px] bg-gradient-to-tl from-zinc-700/10 to-transparent rounded-full blur-[140px] opacity-25 hidden sm:block"
				/>
			</div>

			{/* Minimalist Micro Grid */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

			{/* Soft Radial Vignette */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,3,5,0.65)_100%)]" />
		</div>
	)
}

export default AnimatedBackground
