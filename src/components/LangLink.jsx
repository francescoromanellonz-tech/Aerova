import { forwardRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PREFIXES = ['/vi', '/ru', '/fr', '/zh'];

function getLangPrefix(pathname) {
  for (const p of PREFIXES) {
    if (pathname === p || pathname.startsWith(p + '/')) {
      return p;
    }
  }
  return '';
}

const LangLink = forwardRef(({ to, ...props }, ref) => {
  const { pathname } = useLocation();
  const prefix = getLangPrefix(pathname);

  const prefixedTo =
    typeof to === 'string' && to.startsWith('/') ? prefix + to : to;

  return <Link ref={ref} to={prefixedTo} {...props} />;
});

LangLink.displayName = 'LangLink';
export default LangLink;
