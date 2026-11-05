import { Avatar, Group, Paper, Stack, Text, Typography } from '@mantine/core';
import classes from './aboutUs.module.css';

export default function AboutUs() {
  return (
    <Stack>
        <Stack gap={5} mb="md">
            <Text fw={300} size="15px" c="dimmed">
                Customer Stories
            </Text>
            <Text fw={700} size="30px">
                What They Say
            </Text>
        </Stack>
        <Paper withBorder radius="md" className={classes.comment}>
            <Group>
                <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                alt="Jacob Warnhalter"
                radius="xl"
                />
                <div>
                <Text fz="sm">Jacob Warnhalter</Text>
                <Text fz="xs" c="dimmed">
                    10 minutes ago
                </Text>
                </div>
            </Group>
            <Typography className={classes.body}>
                <div
                className={classes.content}
                dangerouslySetInnerHTML={{
                    __html:
                    '<p>I use <a href="https://heroku.com/" rel="noopener noreferrer" target="_blank">Heroku</a> to host my Node.js application, but MongoDB add-on appears to be too <strong>expensive</strong>. I consider switching to <a href="https://www.digitalocean.com/" rel="noopener noreferrer" target="_blank">Digital Ocean</a> VPS to save some cash.</p>',
                }}
                />
            </Typography>
        </Paper>
        <Paper withBorder radius="md" className={classes.comment}>
            <Group>
                <Avatar
                src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                alt="Jacob Warnhalter"
                radius="xl"
                />
                <div>
                <Text fz="sm">Jacob Warnhalter</Text>
                <Text fz="xs" c="dimmed">
                    10 minutes ago
                </Text>
                </div>
            </Group>
            <Typography className={classes.body}>
                <div
                className={classes.content}
                dangerouslySetInnerHTML={{
                    __html:
                    '<p>I use <a href="https://heroku.com/" rel="noopener noreferrer" target="_blank">Heroku</a> to host my Node.js application, but MongoDB add-on appears to be too <strong>expensive</strong>. I consider switching to <a href="https://www.digitalocean.com/" rel="noopener noreferrer" target="_blank">Digital Ocean</a> VPS to save some cash.</p>',
                }}
                />
            </Typography>
        </Paper>
    </Stack>
  );
}