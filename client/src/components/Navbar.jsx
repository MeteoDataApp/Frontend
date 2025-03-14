import { Box, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Heading, Text, HStack, Link } from '@chakra-ui/react';
import { FaHome, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const MotionBox = motion(Box);
    const MotionFlex = motion(Flex);
    
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
            as={"nav"}
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
                        cursor={'pointer'}
                        onClick={() => navigate("/")}
                    >
                        Meteo Data
                    </Heading>
                </MotionBox>

                <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
                    <MotionBox>
                        <Link href="/" fontSize="lg" color="gray.600" _hover={{ color: '#4F46E5' }}>
                            <HStack>
                                <FaHome />
                                <Text>Home</Text>
                            </HStack>
                        </Link>
                    </MotionBox>

                    <MotionBox>
                        <Link href="/about" fontSize="lg" color="gray.600" _hover={{ color: '#4F46E5' }}>
                            <HStack>
                                <FaInfoCircle />
                                <Text>About Us</Text>
                            </HStack>
                        </Link>
                    </MotionBox>
                </HStack>
            </MotionFlex>
        </MotionBox>
    );
};

export default Navbar;