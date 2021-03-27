import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Avatar from '@material-ui/core/Avatar';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';

const styles = ({ palette }) => {
	return {
		root: ({ collapsed }) => ({
			minWidth: collapsed ? 56 : 64,
			minHeight: collapsed ? 56 : 48,
			backgroundColor: palette.common.white,
			padding: `8px ${collapsed ? '8px' : '24px'} 8px ${collapsed ? '8px' : '16px'
				}`,
			borderRadius: 40,
			boxShadow:
				'0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
			'&:hover': {
				boxShadow:
					'0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149)',
				backgroundColor: '#fafafb',
			},
			'&:active': {
				backgroundColor: '#f1f3f4',
			},
		}),
		label: {
			fontFamily:
				"'Google Sans', Roboto,RobotoDraft,Helvetica,Arial,sans-serif",
			color: '#3c4043',
			textTransform: 'none',
			fontWeight: 500,
		},
		img: {
			width: 32,
			height: 32,
		},
		startIcon: ({ collapsed }) => ({
			margin: collapsed ? 0 : '',
		}),
	};
};

const useStyles = makeStyles(styles, { name: 'GmailButton' })
const CustomButton = ({ collapsed, classes, label = 'Compose', menu = false, ...props }) => {
	const styles = useStyles({ collapsed, ...props })
	const { img: imgClassName, ...buttonClasses } = styles;
	const { children } = props;

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				onClick={menu ? handleClick : props.onClick}
				disableRipple
				{...props}
				classes={buttonClasses}
				startIcon={
					<Avatar
						className={imgClassName}
						src={
							'https://www.gstatic.com/images/icons/material/colored_icons/2x/create_32dp.png'
						}
					/>
				}
			>
				{!collapsed && label}
			</Button>

			{
				menu && (
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						{children}
					</Menu>
				)
			}
		</>
	);
}
export default CustomButton;
