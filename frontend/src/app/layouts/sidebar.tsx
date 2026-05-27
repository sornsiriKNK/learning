"use client";

import * as React from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from "@mui/material/Typography";

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(true);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
                <Typography sx={{ p: 1 }} variant="h6">Learning</Typography>
                <MenuIcon
                    sx={{ fontSize: 40, cursor: "pointer" }}
                    onClick={(event) => {
                        event.stopPropagation();
                        toggleDrawer(false)();
                    }}
                />
            </Box>
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ bgcolor: "red", height: "100vh", p: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <MenuIcon sx={{ fontSize: 40 }} onClick={toggleDrawer(true)} />
            </Box>

            <Drawer hideBackdrop={true} open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </Box>
    );
}