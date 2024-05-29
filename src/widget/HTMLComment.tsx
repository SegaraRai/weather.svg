declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      htmlComment: {
        content: string;
      };
    }
  }
}

export function HTMLComment({ children }: { readonly children: string }) {
  if (import.meta.env.DEV) {
    return <script type="text/plain">{children}</script>;
  }

  return <htmlComment content={children} />;
}
