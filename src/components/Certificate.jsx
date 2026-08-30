import React, { useState } from "react"
import { Modal, IconButton, Box, Backdrop, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import FullscreenIcon from "@mui/icons-material/Fullscreen"

const Certificate = ({ ImgSertif, title, issuer, date, description }) => {
	const [open, setOpen] = useState(false)

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<Box component="div" sx={{ width: "100%" }}>
			{/* Thumbnail Container */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					borderRadius: "16px",
					border: "1px solid rgba(255, 255, 255, 0.08)",
					bgcolor: "#08080c",
					boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-4px)",
						borderColor: "rgba(255, 255, 255, 0.2)",
						boxShadow: "0 16px 36px rgba(0,0,0,0.8)",
						"& .overlay": {
							opacity: 1,
						},
						"& .hover-content": {
							transform: "translate(-50%, -50%)",
							opacity: 1,
						},
						"& .certificate-image": {
							transform: "scale(1.03)",
						},
					},
				}}>
				{/* Certificate Image */}
				<Box sx={{ position: "relative", overflow: "hidden" }}>
					<img
						className="certificate-image"
						src={ImgSertif}
						alt="Certificate"
						style={{
							width: "100%",
							height: "auto",
							display: "block",
							objectFit: "cover",
							filter: "contrast(1.05) brightness(0.95)",
							transition: "all 0.5s ease",
						}}
						onClick={handleOpen}
					/>
				</Box>

				{/* Hover Overlay */}
				<Box
					className="overlay"
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0,
						backgroundColor: "rgba(0, 0, 0, 0.65)",
						backdropFilter: "blur(3px)",
						transition: "all 0.3s ease",
						cursor: "pointer",
						zIndex: 2,
					}}
					onClick={handleOpen}>
					{/* Hover Content */}
					<Box
						className="hover-content"
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -60%)",
							opacity: 0,
							transition: "all 0.3s ease",
							textAlign: "center",
							width: "100%",
							color: "white",
						}}>
						<FullscreenIcon
							sx={{
								fontSize: 36,
								mb: 0.5,
								filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))",
							}}
						/>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 600,
								letterSpacing: "0.05em",
								textTransform: "uppercase",
								fontSize: "0.75rem",
							}}>
							View Certificate
						</Typography>
					</Box>
				</Box>
			</Box>

			{/* Certificate Details */}
			{(title || issuer || date || description) && (
				<Box sx={{ mt: 2, px: 0.5 }}>
					{title && (
						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								fontSize: "1.05rem",
								color: "#f4f4f5",
								mb: 0.5,
							}}>
							{title}
						</Typography>
					)}
					{issuer && (
						<Typography
							variant="body2"
							sx={{
								color: "#a1a1aa",
								fontSize: "0.82rem",
								mb: 0.5,
								display: "flex",
								alignItems: "center",
								gap: 0.8,
							}}>
							<span style={{ color: "#d4d4d8" }}>📜</span> {issuer}
						</Typography>
					)}
					{date && (
						<Typography
							variant="body2"
							sx={{
								color: "#71717a",
								fontSize: "0.78rem",
								mb: 1,
								display: "flex",
								alignItems: "center",
								gap: 0.8,
							}}>
							<span style={{ color: "#a1a1aa" }}>📅</span> {date}
						</Typography>
					)}
					{description && (
						<Typography
							variant="body2"
							sx={{
								color: "#a1a1aa",
								fontSize: "0.82rem",
								lineHeight: 1.5,
								mt: 0.8,
								fontWeight: 300,
							}}>
							{description}
						</Typography>
					)}
				</Box>
			)}

			{/* Modal */}
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.92)",
						backdropFilter: "blur(8px)",
					},
				}}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					margin: 0,
					padding: 0,
				}}>
				<Box
					sx={{
						position: "relative",
						width: "auto",
						maxWidth: "90vw",
						maxHeight: "90vh",
						m: 0,
						p: 0,
						outline: "none",
					}}>
					{/* Close Button */}
					<IconButton
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 16,
							top: 16,
							color: "white",
							bgcolor: "rgba(0,0,0,0.7)",
							border: "1px solid rgba(255,255,255,0.15)",
							zIndex: 1,
							padding: 1,
							"&:hover": {
								bgcolor: "rgba(0,0,0,0.9)",
								transform: "scale(1.05)",
							},
						}}
						size="large">
						<CloseIcon sx={{ fontSize: 22 }} />
					</IconButton>

					{/* Modal Image */}
					<img
						src={ImgSertif}
						alt="Certificate Full View"
						style={{
							display: "block",
							maxWidth: "100%",
							maxHeight: "90vh",
							margin: "0 auto",
							borderRadius: "12px",
							objectFit: "contain",
							boxShadow: "0 24px 60px rgba(0,0,0,0.9)",
						}}
					/>
				</Box>
			</Modal>
		</Box>
	)
}

export default Certificate
