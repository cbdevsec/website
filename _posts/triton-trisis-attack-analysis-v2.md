# TRITON/TRISIS: When Malware Went After the Safety Systems

## Why I picked this one

Most well-known breaches are about stolen data or ransom money. TRITON is different, and that's exactly why I chose it. In 2017, someone built malware specifically to go after Safety Instrumented Systems (SIS) — the controllers whose entire job is to shut a plant down safely before something explodes or leaks. It's not about money. It's about whether a physical process stays safe. That's a different kind of threat model than anything I'd looked at before, and given my OT security background, it felt like the right case to really dig into.

## Background

The target was a petrochemical plant, and the specific system was Schneider Electric's Triconex Emergency Shutdown (ESD) system — an SIS. If you're not familiar with SIS: think of it as the last safety net in an industrial plant. Pressure gets too high, temperature spikes past a safe limit, whatever it is — the SIS is supposed to notice and shut things down before it becomes a disaster. It's usually engineering's territory, not security's, which is part of why this attack was such a wake-up call. Nobody was really watching that layer from a security lens before this.

Attribution took a while to land. It wasn't until 2018 that investigators felt confident enough to point at a Russian state-affiliated research institute, and the U.S. Treasury didn't officially sanction that institute until 2020. So this wasn't solved overnight — worth remembering when people expect fast, clean answers after a breach.

## What actually happened, step by step

The attacker didn't start anywhere near the safety system. They'd been sitting inside the plant's regular corporate IT network for about a year before making any real move toward the OT side. That's honestly one of the more unsettling details — a full year of quiet presence before anything OT-related even started.

From there, they moved deeper into the network. The tools they used for this weren't anything exotic — functionally, they worked a lot like Mimikatz or PSExec (common credential-stealing/remote-execution tools), just custom-built versions. Eventually this lateral movement got them to an engineering workstation — a Windows machine that had legitimate access to actually program the Triconex controllers. This workstation was the whole ballgame. Once they had it, they had a real path to the safety system itself.

Here's where it gets interesting. They dropped a file called `trilog.exe` onto that workstation — deliberately named to look almost identical to Triconex's actual, legitimate log-review tool. Simple trick, but effective: an engineer glancing at the file list wouldn't necessarily think twice about it. Bundled with it were two payload files, referred to in the public reports as `inject.bin` and `imain.bin`.

What I found genuinely surprising researching this: there was no software exploit involved. No zero-day, no clever bug. The protocol used to talk to these controllers — TriStation — simply had no authentication built into it at all. If you could speak the protocol, the controller would listen to you, no questions asked. The attackers had to reverse-engineer an undocumented protocol to pull this off, which took real skill, but once they cracked it, they didn't need to exploit anything — the door was just unlocked the whole time.

And then, almost by accident, they got caught. Some of the SIS controllers dropped into a failed-safe state — meaning they did exactly what they're designed to do, and shut the process down. That unexpected shutdown is what got people asking questions, and that's ultimately how the intrusion came to light. The safety system worked. It just also happened to blow the attacker's cover in the process.

## Mapping this to MITRE ATT&CK for ICS

I tried to map each stage of the attack to the closest official ATT&CK for ICS tactic/technique. One honest caveat first: the very first stage — how they got into the corporate IT network to begin with — isn't something public reporting nails down clearly. I'm not going to pretend otherwise or guess at a specific technique just to fill the cell.

| Stage | Tactic (ATT&CK for ICS) | Technique | What happened |
|---|---|---|---|
| 1 | Initial Access (IT network) | Not disclosed publicly | Foothold established in corporate IT network ~1 year before OT compromise |
| 2 | Lateral Movement | Valid Accounts / Remote Services (Mimikatz/PSExec-style custom tools) | Moved from IT toward OT network |
| 3 | Initial Access (OT network) | Engineering Workstation Compromise | Gained remote access to the SIS engineering workstation |
| 4 | Defense Evasion | Masquerading (T0849) | `trilog.exe` disguised as the legitimate Triconex log tool |
| 5 | Execution / Impact | Program Download / Modify Controller | Reprogrammed controllers via the unauthenticated TriStation protocol |
| 6 | Impact | Loss of Safety / Denial of Safety Function | Controllers entered failed-safe state, halting the process and exposing the attack |

## Detection & Mitigation — my take

*(Writing this part myself, in my own words, since this is where I want my own thinking to actually show)*

## What this taught me

*(Same here — my own reflection goes in this section)*

---

*Researched from Mandiant's original TRITON report, Dragos's independent analysis, Midnight Blue's technical breakdown, and Cisco's write-up on the Triconex attack chain. Everything above is written in my own words after reading through those sources.*
