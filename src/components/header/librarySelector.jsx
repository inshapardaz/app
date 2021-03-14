/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import { libraryService } from '../../services';

export default function LibrarySelector() {
	const history = useHistory();
	let libraries = libraryService.getUserLibrariesFromCache();
	let selectedLibrary = libraryService.getSelectedLibrary();

	const anchorRef = React.useRef(null);
	const [open, setOpen] = React.useState(false);

	const handleToggle = () => {
		libraries = libraryService.getUserLibrariesFromCache();
		selectedLibrary = libraryService.getSelectedLibrary();
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};

	const handleListKeyDown = (event) => {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	};

	const selectLibrary = (library) => {
		history.push(`/library/${library.id}`);
	};

	const langMenu = (
		<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
			{({ TransitionProps, placement }) => (
				<Grow
					{...TransitionProps}
					style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
				>
					<Paper>
						<ClickAwayListener onClickAway={handleClose}>
							<MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
								{libraries && libraries.map(l =>
									<MenuItem key={l.id}
										onClick={() => selectLibrary(l)}
										selected={selectedLibrary != null && l.id === selectedLibrary.id}>
										{l.name}
									</MenuItem>
								)}
							</MenuList>
						</ClickAwayListener>
					</Paper>
				</Grow>
			)}
		</Popper>
	);

	return (
		<>
			<Button
				ref={anchorRef}
				aria-controls={open ? 'menu-list-grow' : undefined}
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggle}
				endIcon={<LocalLibraryIcon />}
			>
			</Button>
			{langMenu}
		</>
	);
}
