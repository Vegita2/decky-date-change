import os

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code repo
# and add the `decky-loader/plugin/imports` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky
import asyncio


class Plugin:
    # A normal method. It can be called from the TypeScript side using @decky/api.
    async def add(self, left: int, right: int) -> int:
        return left + right

    async def get_system_datetime(self):
        proc = await asyncio.create_subprocess_shell(
            'date +"%Y %m %d %H %M"',
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE)
        stdout, stderr = await proc.communicate()

        date_parts = stdout.decode().strip().split()

        return [
            int(date_parts[0]),  # year
            int(date_parts[1]),  # month
            int(date_parts[2]),  # day
            int(date_parts[3]),  # hour
            int(date_parts[4])  # minute
        ]

    async def set_system_datetime(self, year: int, month: int, day: int, hour: int, minute: int, second: int):
        datestr = f'{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}'
        os.system('sudo timedatectl set-ntp false')
        os.system(f'sudo timedatectl set-time "{datestr}"')

    async def auto_datetime(self):
        os.system("sudo timedatectl set-ntp true")

    async def long_running(self):
        await asyncio.sleep(15)
        # Passing through a bunch of random data, just as an example
        await decky.emit("timer_event", "Hello from the backend!", True, 2)

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        self.loop = asyncio.get_event_loop()

    # Function called first during the unload process, utilize this to handle your plugin being stopped, but not
    # completely removed
    async def _unload(self):
        pass

    # Function called after `_unload` during uninstall, utilize this to clean up processes and other remnants of your
    # plugin that may remain on the system
    async def _uninstall(self):
        pass

    async def start_timer(self):
        self.loop.create_task(self.long_running())
