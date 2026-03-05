type LogLevel = "LOG" | "INFO" | "WARN" | "ERROR";

// ANSI codes
const R      = "\x1b[0m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";
const GRAY   = "\x1b[90m";
const WHITE  = "\x1b[97m";
const CYAN   = "\x1b[96m";
const YELLOW = "\x1b[93m";
const RED    = "\x1b[91m";
const BG_GRAY   = "\x1b[100m";
const BG_BLUE   = "\x1b[44m";
const BG_YELLOW = "\x1b[43m";
const BG_RED    = "\x1b[41m";

const LEVELS: Record<LogLevel, { label: string; color: string; bg: string }> = {
    LOG:   { label: " LOG  ", color: WHITE,  bg: BG_GRAY   },
    INFO:  { label: " INFO ", color: CYAN,   bg: BG_BLUE   },
    WARN:  { label: " WARN ", color: YELLOW, bg: BG_YELLOW },
    ERROR: { label: " ERR  ", color: RED,    bg: BG_RED    },
};

function timestamp(): string {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function stringify(args: unknown[]): string {
    return args.map(a => {
        if (typeof a === "string") return a;
        if (a instanceof Error) return `${a.name}: ${a.message}`;
        return Deno.inspect(a, { colors: false, depth: 2 });
    }).join(" ");
}

const isDev = Deno.env.get("STATE") === "DEVELOPMENT";
let logDir: string | null = null;

function writeToFile(level: LogLevel, message: string): void {
    if (!logDir) return;
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    const file = `${logDir}/${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.log`;
    const line = `${timestamp()} [${level.padEnd(5)}] ${message}\n`;
    Deno.writeTextFile(file, line, { append: true }).catch(() => {});
}

class PrettyLogger {
    initFileLogger(dir: string): this {
        logDir = dir;
        try { Deno.mkdirSync(dir, { recursive: true }); } catch { /* exists */ }
        return this;
    }

    private print(level: LogLevel, args: unknown[]): void {
        const msg = stringify(args);

        if (isDev) {
            const { label, color, bg } = LEVELS[level];
            const ts    = `${DIM}${GRAY}${timestamp()}${R}`;
            const badge = `${BOLD}${WHITE}${bg}${label}${R}`;
            const line  = `${ts}  ${badge}  ${color}${msg}${R}`;
            if (level === "ERROR") console.error(line);
            else if (level === "WARN") console.warn(line);
            else console.log(line);
        }

        writeToFile(level, msg);
    }

    log(...args: unknown[]): void   { this.print("LOG",   args); }
    info(...args: unknown[]): void  { this.print("INFO",  args); }
    warn(...args: unknown[]): void  { this.print("WARN",  args); }
    error(...args: unknown[]): void { this.print("ERROR", args); }

    table(headers: string[], rows: (string | number)[][]): void {
        if (!isDev) return;
        const widths = headers.map((h, i) =>
            Math.max(h.length, ...rows.map(r => String(r[i] ?? "").length))
        );

        const border = (l: string, sep: string, r: string) =>
            `${CYAN}${l}${widths.map(w => "─".repeat(w + 2)).join(sep)}${r}${R}`;

        const row = (cells: (string | number)[], isHeader = false) => {
            const cols = cells.map((c, i) => {
                const s = String(c ?? "").padEnd(widths[i]);
                return isHeader ? `${BOLD}${WHITE}${s}${R}` : `${WHITE}${s}${R}`;
            });
            return `${CYAN}│${R} ${cols.join(` ${CYAN}│${R} `)} ${CYAN}│${R}`;
        };

        console.log(border("┌", "┬", "┐"));
        console.log(row(headers, true));
        console.log(border("├", "┼", "┤"));
        rows.forEach(r => console.log(row(r)));
        console.log(border("└", "┴", "┘"));
    }

    banner(title: string, subtitle?: string): void {
        if (!isDev) return;
        const width = Math.max(title.length, subtitle?.length ?? 0) + 4;
        const bar   = "═".repeat(width);
        const pad   = (s: string) => {
            const space = width - s.length;
            return " ".repeat(Math.floor(space / 2)) + s + " ".repeat(Math.ceil(space / 2));
        };
        console.log(`\n${CYAN}${BOLD}╔${bar}╗`);
        console.log(`║${WHITE}${pad(title)}${CYAN}║`);
        if (subtitle) console.log(`║${DIM}${WHITE}${pad(subtitle)}${R}${CYAN}${BOLD}║`);
        console.log(`╚${bar}╝${R}\n`);
    }
}

const logger = new PrettyLogger();

if (!isDev) {
    logger.initFileLogger("./logs");
}

export default logger;
