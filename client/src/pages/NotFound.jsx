/* eslint-disable react/no-unescaped-entities */
import { motion } from 'framer-motion';
import { Box, Heading, Text, Button, Flex } from '@chakra-ui/react';
import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NotFound = () => {
    const navigate = useNavigate();
    const MotionBox = motion.create(Box);
    const MotionButton = motion.create(Button);

    const [activeLanguage, setActiveLanguage] = useState(null);

    const i18nextLng = localStorage.getItem("i18nextLng");

    useEffect(() => {
        if (!i18nextLng) {
            localStorage.setItem("i18nextLng", "en");
        }

        setActiveLanguage(i18nextLng);
        console.log("Language set to: ", i18nextLng);

    }, [i18nextLng]);

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            minH="100vh"
            bgGradient="linear(to-br, #f0f4ff 0%, #f8fafc 100%)"
            p={8}
        >
            <Flex
                direction="column"
                align="center"
                justify="center"
                minH="90vh"
                textAlign="center"
            >
                <MotionBox
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                >
                    <Heading
                        fontSize={{ base: '6xl', md: '8xl' }}
                        fontWeight="black"
                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                        bgClip="text"
                        mb={6}
                        letterSpacing="tighter"
                    >
                        404
                    </Heading>
                    <Text
                        fontSize="xl"
                        color="gray.600"
                        maxW="2xl"
                        mx="auto"
                        mb={8}
                    >
                        {activeLanguage === "en" ? "Oops! The page you were looking for could not be found." : "糟糕！您要查找的页面不存在。"}
                    </Text>
                    <MotionButton
                        size="lg"
                        colorScheme="blue"
                        bgGradient="linear(to-r, #6366f1, #ec4899)"
                        _hover={{ bgGradient: "linear(to-r, #818cf8, #f472b6)" }}
                        rightIcon={<FiHome />}
                        onClick={() => navigate('/')}
                        px={8}
                        py={6}
                        borderRadius="xl"
                        fontWeight="bold"
                        color="white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {activeLanguage === "en" ? "Return to home" : "返回首页"}
                    </MotionButton>
                </MotionBox>
            </Flex>
        </MotionBox>
    );
};

export default NotFound;