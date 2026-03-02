import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Flex,
  Text,
  Badge,
  Button,
  DropdownMenu,
  IconButton,
  Avatar,
} from "@radix-ui/themes";
import {
  FiMenu,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiBarChart2,
  FiBook,
  FiLayers,
  FiAlertCircle,
  FiZap,
} from "react-icons/fi";
import { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", Icon: FiBarChart2 },
    { path: "/estudos", label: "Estudos", Icon: FiBook },
    { path: "/projetos", label: "Projetos", Icon: FiLayers },
    { path: "/problemas", label: "Problemas", Icon: FiAlertCircle },
    { path: "/perfil", label: "Perfil", Icon: FiUser },
  ];

  return (
    <nav className="navbar-radix">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Flex align="center" gap="2">
            <Flex
              align="center"
              justify="center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
              }}
            >
              <FiZap size={22} color="white" />
            </Flex>
            <Text size="3" weight="bold" className="hidden-sm">
              DevTrack
            </Text>
          </Flex>
        </Link>

        <Flex gap="2" align="center" className="nav-desktop">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  className={active ? "nav-link nav-link-active" : "nav-link"}
                  variant={active ? "solid" : "ghost"}
                  color="teal"
                  size="2"
                >
                  <item.Icon size={16} style={{ marginRight: 6 }} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </Flex>

        {user && (
          <Flex align="center" gap="3">
            <Flex align="center" gap="2" className="hidden-sm">
              <Text size="2" weight="medium">
                {user.name}
              </Text>
              <Badge color="accent" variant="soft" size="1">
                Nível {user.level}
              </Badge>
            </Flex>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="soft" size="2">
                  <Avatar
                    size="1"
                    radius="full"
                    src={user.avatar || undefined}
                    fallback={
                      user.name?.charAt(0).toUpperCase() || "?"
                    }
                  />
                  <FiChevronDown />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align="end" size="2">
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--gray-6)",
                  }}
                >
                  <Text size="2" weight="bold" as="div">
                    {user.name}
                  </Text>
                  <Text size="1" color="gray" as="div">
                    {user.email}
                  </Text>

                  <Flex gap="2" mt="2">
                    <Badge color="green" size="1">
                      XP: {user.xp}
                    </Badge>
                    <Badge color="teal" size="1">
                      Nível {user.level}
                    </Badge>
                  </Flex>
                </div>

                <DropdownMenu.Separator />

                <DropdownMenu.Item asChild>
                  <Link to="/perfil">
                    <FiUser />
                    Meu Perfil
                  </Link>
                </DropdownMenu.Item>

                {user.role === "admin" && (
                  <>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item disabled>
                      <Text weight="bold" color="accent">
                        Painel Admin
                      </Text>
                    </DropdownMenu.Item>
                  </>
                )}

                <DropdownMenu.Separator />

                <DropdownMenu.Item color="red" onClick={logout}>
                  <FiLogOut />
                  Sair
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            <IconButton
              variant="ghost"
              size="2"
              className="nav-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <FiMenu />
            </IconButton>
          </Flex>
        )}
      </div>

      {mobileOpen && (
        <div className="nav-mobile-menu">
          <Flex direction="column" gap="2" p="4">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    className={active ? "nav-link nav-link-active" : "nav-link"}
                    variant={active ? "solid" : "ghost"}
                    color="teal"
                    size="3"
                    style={{
                      width: "100%",
                      justifyContent: "flex-start",
                    }}
                  >
                    <item.Icon
                      size={18}
                      style={{ marginRight: 10 }}
                    />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </Flex>
        </div>
      )}
    </nav>
  );
}
