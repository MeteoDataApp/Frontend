import { useState } from 'react';
import { Box, Flex, Heading, Text, HStack, Link, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerBody, VStack, CloseButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaDatabase, FaHome, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const MotionBox = motion.create(Box);
    const MotionFlex = motion.create(Flex);

    const links = [
        { name: 'Home', path: '/', icon: FaHome },
        { name: 'Dashboard', path: '/dashboard', icon: FaDatabase },
        { name: 'About Us', path: '/about', icon: FaInfoCircle },
    ];

    return (
        <MotionBox
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            w="100%"
            position="fixed"
            top={0}
            bg="whiteAlpha.800"
            backdropFilter="blur(10px)"
            borderBottom="1px solid #e2e8f0"
            borderColor="purple.100"
            as="nav"
            zIndex={999}
        >
            <MotionFlex
                maxW="1200px"
                mx="auto"
                px={6}
                py={4}
                justify="space-between"
                align="center"
            >
                <MotionBox>
                    <Heading
                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                        bgClip="text"
                        fontSize="2xl"
                        fontWeight="bold"
                        cursor="pointer"
                        onClick={() => navigate("/")}
                    >
                        Meteo Data
                    </Heading>
                </MotionBox>

                <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                    {links.map((link) => (
                        <MotionBox key={link.name}>
                            <Link
                                fontSize="lg"
                                color="gray.600"
                                _hover={{
                                    textDecoration: "none",
                                    color: '#4F46E5'
                                }}
                                _active={{
                                    transform: "scale(0.95)",
                                }}
                                transition="all 0.2s"
                                onClick={() => navigate(link.path)}
                            >
                                <HStack>
                                    <Box as={link.icon} />
                                    <Text>{link.name}</Text>
                                </HStack>
                            </Link>
                        </MotionBox>
                    ))}
                </HStack>

                <IconButton
                    display={{ base: 'flex', md: 'none' }}
                    icon={<HamburgerIcon />}
                    onClick={() => setIsOpen(true)}
                    aria-label="Open menu"
                    bgColor={'transparent'}
                    _hover={{
                        bgColor: 'transparent',
                        color: '#4F46E5'
                    }}
                />

                <Drawer isOpen={isOpen} placement="right" onClose={() => setIsOpen(false)} size="xs">
                    <DrawerOverlay backdropFilter="blur(3px)" />
                    <DrawerContent
                        bg="white"
                        backdropFilter="blur(20px)"
                        boxShadow="2xl"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DrawerBody p={6} position="relative">
                                {/* Close Button */}
                                <Flex justify="flex-end" mb={8}>
                                    <IconButton
                                        aria-label="Close menu"
                                        icon={<FaTimes />}
                                        onClick={() => setIsOpen(false)}
                                        variant="ghost"
                                        borderRadius="full"
                                        size="lg"
                                        color="gray.600"
                                        _hover={{
                                            bg: 'whiteAlpha.300',
                                            color: '#4F46E5',
                                            transform: 'rotate(90deg)'
                                        }}
                                        transition="all 0.2s ease-in-out"
                                    />
                                </Flex>

                                {/* Navigation Links */}
                                <VStack
                                    spacing={8}
                                    align="stretch"
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {links.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{
                                                delay: index * 0.2,
                                                type: "spring",
                                                stiffness: 100
                                            }}
                                        >
                                            <Link
                                                onClick={() => {
                                                    navigate(link.path);
                                                    setIsOpen(false);
                                                }}
                                                p={4}
                                                borderRadius="lg"
                                                display="flex"
                                                alignItems="center"
                                                _hover={{
                                                    bg: 'whiteAlpha.300',
                                                    textDecoration: 'none',
                                                    transform: 'translateX(3px)'
                                                }}
                                                _active={{
                                                    transform: 'scale(0.98)'
                                                }}
                                                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                            >
                                                <HStack spacing={4}>
                                                    <Box
                                                        as={link.icon}
                                                        boxSize={6}
                                                        color="#4F46E5"
                                                        transition="transform 0.3s"
                                                        _groupHover={{
                                                            transform: 'scale(1.2)'
                                                        }}
                                                    />
                                                    <Text
                                                        fontSize="xl"
                                                        fontWeight="semibold"
                                                        color="gray.700"
                                                        _hover={{
                                                            color: '#4F46E5'
                                                        }}
                                                    >
                                                        {link.name}
                                                    </Text>
                                                </HStack>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </VStack>
                            </DrawerBody>
                        </motion.div>
                    </DrawerContent>
                </Drawer>
            </MotionFlex>
        </MotionBox>
    );
};

export default Navbar;