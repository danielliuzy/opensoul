# opensoul

CLI for [OpenSOUL.md](https://opensoul.md) — search, pull, and swap AI personality files (SOUL.md) from the registry.

## Install

```bash
npm install -g opensoul
```

## Commands

```
soul possess <name>    Swap your active SOUL.md
soul exorcise          Restore your original SOUL.md
soul search <query>    Search the registry
soul summon <name>     Download a soul to local cache
soul list              Show cached souls
soul banish <name>     Remove a soul from cache
soul status            Show current soul state
soul path              Show or set SOUL.md location
soul config            Get or set CLI config values
soul install           Install the OpenSoul skill into OpenClaw
soul uninstall         Remove the skill
```

## Quick start

```bash
# Search for a soul
soul search pirate

# Swap your bot's personality
soul possess pirate

# Go back to your original personality
soul exorcise
```

## License

MIT
