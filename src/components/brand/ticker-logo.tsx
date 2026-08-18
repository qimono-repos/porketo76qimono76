import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, string> = {
  sm: "size-8 rounded-md",
  md: "size-9 rounded-lg",
  lg: "size-12 rounded-xl",
  xl: "size-20 rounded-2xl",
};

const ICON: Record<Size, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

type Mark = {
  bg: string;
  title: string;
  node: ReactNode;
};

function Svg({
  children,
  fill = "currentColor",
}: {
  children: ReactNode;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className="size-[62%] shrink-0" fill={fill} aria-hidden>
      {children}
    </svg>
  );
}

const MARKS: Record<string, Mark> = {
  AAPL: {
    bg: "#111111",
    title: "Apple",
    node: (
      <Svg fill="#f5f5f7">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
      </Svg>
    ),
  },
  MSFT: {
    bg: "#f3f3f3",
    title: "Microsoft",
    node: (
      <svg viewBox="0 0 24 24" className="size-[64%] shrink-0" aria-hidden>
        <rect x="1.2" y="1.2" width="10" height="10" fill="#F25022" />
        <rect x="12.8" y="1.2" width="10" height="10" fill="#7FBA00" />
        <rect x="1.2" y="12.8" width="10" height="10" fill="#00A4EF" />
        <rect x="12.8" y="12.8" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
  META: {
    bg: "#0668E1",
    title: "Meta",
    node: (
      <Svg fill="#ffffff">
        <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
      </Svg>
    ),
  },
  GOOGL: {
    bg: "#ffffff",
    title: "Alphabet",
    node: (
      <svg viewBox="0 0 24 24" className="size-[64%] shrink-0" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="var(--logo-hot, #34A853)"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="var(--logo-hot, #EA4335)"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  NVDA: {
    bg: "#111111",
    title: "NVIDIA",
    node: (
      <Svg fill="var(--logo-hot, #76B900)">
        <path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4-1.952a6.016 6.016 0 0 0-.796.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.733-.035-1.095-.097v1.325c.3.035.61.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.971-.053v1.864H24V4.063zm0 10.326v1.131c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237H8.94c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.739 3.11M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936z" />
      </Svg>
    ),
  },
  AMD: {
    bg: "#1a1a1a",
    title: "AMD",
    node: (
      <Svg fill="var(--logo-hot, #ED1C24)">
        <path d="M18.324 9.137l1.559 1.56h2.556v2.557L24 14.814V9.137zM2 9.52l-2 4.96h1.309l.37-.982H3.9l.408.982h1.338L3.432 9.52zm4.209 0v4.955h1.238v-3.092l1.338 1.562h.188l1.338-1.556v3.091h1.238V9.52H10.47l-1.592 1.845L7.287 9.52zm6.283 0v4.96h2.057c1.979 0 2.88-1.046 2.88-2.472 0-1.36-.937-2.488-2.747-2.488zm1.237.91h.792c1.17 0 1.63.711 1.63 1.57 0 .728-.372 1.572-1.616 1.572h-.806zm-10.985.273l.791 1.932H2.008zm17.137.307l-1.604 1.603v2.25h2.246l1.604-1.607h-2.246z" />
      </Svg>
    ),
  },
  AMZN: {
    bg: "#111111",
    title: "Amazon",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden fill="none">
        <path
          d="M5 15.2c3.8 2.8 10.2 2.9 14.2.2"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M17.4 13.6c.9 1.5 1.6 2.4 2.2 2.6.2.1.3.3.1.5-.6.6-1.6 1.3-2.4 1.8"
          stroke="#FF9900"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.4 6.2c0-1.5 1.2-2.4 3.1-2.4 1.3 0 2.2.4 2.8 1.1.5.6.7 1.4.7 2.8v4.6h-1.8V8c0-1.2-.5-1.8-1.6-1.8-.9 0-1.5.6-1.5 1.5 0 1.1.6 1.6 1.9 2.1 1.7.6 3.2 1.3 3.2 3.3 0 1.9-1.4 3.1-3.6 3.1-1.6 0-2.8-.5-3.6-1.5-.3-.4-.5-.8-.6-1.3l1.7-.4c.1.8.8 1.6 2.4 1.6 1.1 0 1.8-.6 1.8-1.4 0-1.1-.7-1.5-2.2-2.1-1.6-.6-2.9-1.5-2.9-3.5z"
          fill="#ffffff"
        />
      </svg>
    ),
  },
  IBM: {
    bg: "#0F62FE",
    title: "IBM",
    node: (
      <svg viewBox="0 0 24 24" className="size-[72%] shrink-0" aria-hidden>
        <g fill="#ffffff">
          <rect x="2" y="3.1" width="5.2" height="1.15" />
          <rect x="2" y="5.15" width="5.2" height="1.15" />
          <rect x="3.15" y="7.2" width="2.9" height="1.15" />
          <rect x="3.15" y="9.25" width="2.9" height="1.15" />
          <rect x="3.15" y="11.3" width="2.9" height="1.15" />
          <rect x="3.15" y="13.35" width="2.9" height="1.15" />
          <rect x="2" y="15.4" width="5.2" height="1.15" />
          <rect x="2" y="17.45" width="5.2" height="1.15" />
          <rect x="8.4" y="3.1" width="7.2" height="1.15" />
          <rect x="9.2" y="5.15" width="5.6" height="1.15" />
          <rect x="9.9" y="7.2" width="4.2" height="1.15" />
          <rect x="10.5" y="9.25" width="3" height="1.15" />
          <rect x="10.5" y="11.3" width="3" height="1.15" />
          <rect x="9.9" y="13.35" width="4.2" height="1.15" />
          <rect x="9.2" y="15.4" width="5.6" height="1.15" />
          <rect x="8.4" y="17.45" width="7.2" height="1.15" />
          <rect x="16.8" y="3.1" width="5.2" height="1.15" />
          <rect x="16.8" y="5.15" width="5.2" height="1.15" />
          <rect x="16.8" y="7.2" width="2.15" height="1.15" />
          <rect x="16.8" y="9.25" width="3.7" height="1.15" />
          <rect x="16.8" y="11.3" width="3.7" height="1.15" />
          <rect x="16.8" y="13.35" width="2.15" height="1.15" />
          <rect x="16.8" y="15.4" width="5.2" height="1.15" />
          <rect x="16.8" y="17.45" width="5.2" height="1.15" />
        </g>
      </svg>
    ),
  },
  MU: {
    bg: "#111111",
    title: "Micron",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <path
          fill="#F2A900"
          d="M4 18V6h3.1l2.7 6.4h.1L12.6 6H15.8v12h-2.5V10.1h-.1L10.6 18H9.1L6.6 10h-.1V18z"
        />
        <circle cx="18.2" cy="8.2" r="1.6" fill="#F2A900" />
      </svg>
    ),
  },
  TSM: {
    bg: "#7A1F1F",
    title: "TSMC",
    node: (
      <svg viewBox="0 0 24 24" className="size-[78%] shrink-0" aria-hidden>
        <text
          x="12"
          y="15.2"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="7.2"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          TSMC
        </text>
      </svg>
    ),
  },
  IONQ: {
    bg: "#0b1020",
    title: "IonQ",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden fill="none">
        <circle cx="12" cy="12" r="3.1" fill="#7C9CFF" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="#9BB0FF" strokeWidth="1.4" />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3.6"
          stroke="#C5D2FF"
          strokeWidth="1.4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="9"
          ry="3.6"
          stroke="#7C9CFF"
          strokeWidth="1.4"
          transform="rotate(120 12 12)"
        />
      </svg>
    ),
  },
  MDB: {
    bg: "#023430",
    title: "MongoDB",
    node: (
      <Svg fill="var(--logo-hot, #00ED64)">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
      </Svg>
    ),
  },
  QCOM: {
    bg: "#3253DC",
    title: "Qualcomm",
    node: (
      <Svg fill="#ffffff">
        <path d="M12 0C6.22933 0 1.5761 4.48645 1.5761 10.47394c0 6.00417 4.65323 10.47394 10.4239 10.47394.98402 0 1.93468-.13343 2.8353-.3836l1.13412 2.9187c.11675.31688.35025.51702.7672.51702h1.80125c.43364 0 .75052-.28353.55038-.83391l-1.46768-3.81932c2.88534-1.81793 4.80333-5.03683 4.80333-8.8895C22.4239 4.48644 17.77067 0 12 0m4.53648 16.5615l-1.31758-3.41904c-.11675-.28353-.35024-.55038-.85059-.55038h-1.71786c-.43363 0-.7672.28353-.56706.83391l1.73454 4.48645c-.56706.1501-1.18416.21682-1.81793.21682-4.2196 0-7.22168-3.31897-7.22168-7.65532C4.77832 6.1376 7.7804 2.81862 12 2.81862s7.22168 3.31898 7.22168 7.65532c0 2.5351-1.01737 4.70327-2.6852 6.08756" />
      </Svg>
    ),
  },
  XNDU: {
    bg: "#0A1F44",
    title: "Nasdaq",
    node: (
      <svg viewBox="0 0 24 24" className="size-[72%] shrink-0" aria-hidden>
        <path
          fill="#00A3E0"
          d="M4 17.5 8.2 6.5h3.1L7 17.5zm7.4 0 4.2-11h3.1l-4.2 11zm5.2 0L20 11.2l1.6 1.1L18.1 17.5z"
        />
      </svg>
    ),
  },
  QBTS: {
    bg: "#141028",
    title: "D-Wave",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <path
          fill="#B388FF"
          d="M6 5h6.2c3.7 0 6.3 2.3 6.3 5.9S15.9 17 12.1 17H8.4v2H6zm2.4 2.1v7.7h3.6c2.3 0 3.8-1.4 3.8-3.8s-1.5-3.9-3.8-3.9z"
        />
      </svg>
    ),
  },
  QNT: {
    bg: "#0D0D2B",
    title: "Quant",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden fill="none">
        <circle cx="12" cy="12" r="7.2" stroke="var(--logo-hot, #FF3B3B)" strokeWidth="2.2" />
        <circle cx="12" cy="12" r="2.1" fill="var(--logo-hot, #FF3B3B)" />
        <path d="M12 4.8v3.2M12 16v3.2M4.8 12h3.2M16 12h3.2" stroke="var(--logo-hot, #FF3B3B)" strokeWidth="1.6" />
      </svg>
    ),
  },
  SPCX: {
    bg: "#1B2A4A",
    title: "SPCX",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <path
          fill="#F4C430"
          d="M7 17.5 12 4.5l5 13H7zm2.2-1.6h5.6L12 8.2z"
        />
        <path fill="#F4C430" d="M9.4 19h5.2v1.4H9.4z" />
      </svg>
    ),
  },
  FLKR: {
    bg: "#003478",
    title: "Franklin Korea",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <circle cx="12" cy="12" r="7.4" fill="var(--logo-hot, #CD2E3A)" />
        <path
          fill="#ffffff"
          d="M12 8.4c.9 1.1.9 2.6 0 3.7-.9-1.1-.9-2.6 0-3.7zm0 3.5c1.1.9 2.6.9 3.7 0-1.1-.9-2.6-.9-3.7 0zm0 0c-.9 1.1-.9 2.6 0 3.7.9-1.1.9-2.6 0-3.7zm0 0c-1.1-.9-2.6-.9-3.7 0 1.1.9 2.6.9 3.7 0z"
        />
      </svg>
    ),
  },
  PAXG: {
    bg: "#1a160c",
    title: "Pax Gold",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <circle cx="12" cy="12" r="8" fill="#D4AF37" />
        <circle cx="12" cy="12" r="6.1" fill="currentColor" />
        <path
          fill="#D4AF37"
          d="M12.9 7.4h-1.7l-.2 1.2c-.7.15-1.3.45-1.7.85l1.1 1.1c.25-.25.6-.4 1-.4.5 0 .8.25.8.65 0 .35-.2.55-.85.8l-1.15.45v1.6l.35.05c.15.55.45 1 .85 1.25v1.15h1.7v-1.05c.7-.15 1.25-.5 1.65-.95l-1.15-1.05c-.25.25-.6.45-1 .45-.45 0-.7-.2-.7-.55 0-.3.2-.5.8-.75l1.15-.45V11l-.3-.05a2.2 2.2 0 0 0-.8-1.2V7.4z"
        />
      </svg>
    ),
  },
  BNB: {
    bg: "#1a1506",
    title: "Binance",
    node: (
      <Svg fill="#F0B90B">
        <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z" />
      </Svg>
    ),
  },
  SOL: {
    bg: "#0b0b14",
    title: "Solana",
    node: (
      <svg viewBox="0 0 24 24" className="size-[70%] shrink-0" aria-hidden>
        <path fill="var(--logo-hot, #00FFA3)" d="M5.2 6.2h14.2L17 8.8H2.8z" />
        <path fill="#9945FF" d="M5.2 10.7h14.2L17 13.3H2.8z" />
        <path fill="#DC1FFF" d="M5.2 15.2h14.2L17 17.8H2.8z" />
      </svg>
    ),
  },
  GNO: {
    bg: "#001428",
    title: "Gnosis",
    node: (
      <svg viewBox="0 0 24 24" className="size-[72%] shrink-0" aria-hidden>
        <path
          fill="#3E7BF6"
          d="M12 3.2c4.8 0 8.7 3.9 8.7 8.8S16.8 20.8 12 20.8 3.3 16.9 3.3 12 7.2 3.2 12 3.2zm0 2.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm-3.3 4.4h6.6c.3 2.4-1.2 4.9-3.3 5.8-2.1-.9-3.6-3.4-3.3-5.8z"
        />
      </svg>
    ),
  },
};

export function TickerLogo({
  symbol,
  size = "md",
  tone,
  className,
}: {
  symbol: string;
  size?: Size;
  tone?: "up" | "down";
  className?: string;
}) {
  const key = symbol.toUpperCase();
  const mark = MARKS[key];
  const tileBg = tone
    ? tone === "up"
      ? "var(--color-up)"
      : "var(--color-down)"
    : (mark?.bg ?? "#1f1f24");
  const hotFg = tone
    ? tone === "up"
      ? "color-mix(in oklab, var(--color-up) 28%, white)"
      : "color-mix(in oklab, var(--color-down) 32%, white)"
    : undefined;

  return (
    <span
      className={cn(
        "relative isolate grid shrink-0 place-items-center overflow-hidden shadow-[var(--shadow-border)]",
        SIZES[size],
        className,
      )}
      style={{
        backgroundColor: tileBg,
        color: tileBg,
        ["--logo-hot" as string]: hotFg,
      }}
      title={mark?.title ?? key}
      aria-hidden
    >
      {mark ? mark.node : (
        <span className={cn("font-medium text-foreground", ICON[size])}>{key.slice(0, 1)}</span>
      )}
      {tone ? (
        <span
          className={cn(
            "pointer-events-none absolute inset-0",
            tone === "up" ? "bg-up/45" : "bg-down/45",
          )}
        />
      ) : null}
    </span>
  );
}
