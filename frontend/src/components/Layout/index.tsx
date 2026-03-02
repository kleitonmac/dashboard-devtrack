import Navbar from '../Navbar';
import { Flex, Text } from '@radix-ui/themes';
import './layout.css';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" className="layout">
      <Navbar />

      <main className="main">
        <div className="main-content">
          {children}
        </div>
      </main>

      <footer className="footer">
        <Text size="1" color="gray">
          © 2026 DevTrack. Rastreie sua evolução como desenvolvedor.
        </Text>
      </footer>
    </Flex>
  );
}

export default MainLayout;
