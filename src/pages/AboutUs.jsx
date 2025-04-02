/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { Box, Heading, Text, Icon, Grid, useBreakpointValue, Button, VStack, Avatar, Flex, Link } from '@chakra-ui/react';
import { FiClock, FiAlertTriangle, FiUser } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    const MotionBox = motion.create(Box);
    const MotionButton = motion.create(Button);
    const MotionFlex = motion.create(Flex);

    const { t } = useTranslation();

    const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
    const creditsColumns = useBreakpointValue({ base: 1, md: 2, lg: 4 });

    const features = [
        {
            icon: FiUser,
            title: t("easeOfUse"),
            description: t("intuitiveWebBasedSolutionForAccurateWeatherInformation")
        },
        {
            icon: FiClock,
            title: t("historicalData"),
            description: t("accessAccurateWeatherArchivesAndViewDetailedDataComparisons")
        },
        {
            icon: FiAlertTriangle,
            title: t("riskAnalysis"),
            description: t("advancedImpactAssessmentForBusinesses")
        },
    ];

    const teamMembers = [
        {
            name: "Joshua Long",
            github: "https://github.com/Sadliquid",
            role: t("fullStackDeveloper"),
            avatar: "/sadliquid.jpeg"
        },
        {
            name: "Lincoln Lim",
            github: "https://github.com/lincoln0623",
            role: t("fullStackDeveloper"),
            avatar: "/lincoln0623.jpeg"
        },
        {
            name: "twetrttr",
            github: "https://github.com/lucky0218",
            role: t("founderAndBackendDeveloper"),
            avatar: "/lucky0218.png"
        },
        {
            name: "tth37",
            github: "https://github.com/tth37",
            role: t("founderAndBackendDeveloper"),
            avatar: "/tth37.jpeg"
        }
    ];

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            bgGradient="linear(to-br, #f0f4ff 0%, #f8fafc 100%)"
            minH="100vh"
            py={16}
            px={4}
        >
            <MotionBox
                textAlign="center"
                mb={16}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading
                    bgGradient="linear(to-r, #6366f1, #ec4899)"
                    bgClip="text"
                    fontSize={{ base: '4xl', md: '6xl' }}
                    mb={6}
                    mt={10}
                >
                    {t("aboutMeteoData")}
                </Heading>
                <Text fontSize="xl" color="gray.600" maxW="800px" mx="auto">
                    {t("aboutMeteoDataDescription")}
                </Text>
            </MotionBox>

            <Grid
                templateColumns={`repeat(${gridColumns}, 1fr)`}
                gap={8}
                maxW="1200px"
                mx="auto"
                mb={20}
            >
                {features.map((feature, index) => (
                    <MotionBox
                        key={index}
                        p={8}
                        borderRadius="2xl"
                        bg="whiteAlpha.900"
                        boxShadow="xl"
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.2,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        <Icon as={feature.icon} boxSize={12} color="#4F46E5" mb={4} />
                        <Heading fontSize="2xl" mb={4}>{feature.title}</Heading>
                        <Text color="gray.600">{feature.description}</Text>
                    </MotionBox>
                ))}
            </Grid>

            {/* Team Credits Section */}
            <MotionBox
                maxW="1200px"
                mx="auto"
                mb={16}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <Heading
                    textAlign="center"
                    mb={12}
                    bgGradient="linear(to-r, #6366f1, #ec4899)"
                    bgClip="text"
                    fontSize={{ base: '3xl', md: '4xl' }}
                >
                    {t("meetOurTeam")}
                </Heading>

                <Grid
                    templateColumns={`repeat(${creditsColumns}, 1fr)`}
                    gap={6}
                >
                    {teamMembers.map((member, index) => (
                        <Link key={index} href={member.github} isExternal _hover={{ textDecoration: "none" }}>
                            <MotionFlex
                                key={index}
                                direction="column"
                                alignItems="center"
                                p={6}
                                borderRadius="xl"
                                bg="whiteAlpha.900"
                                boxShadow="lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    whileHover: { type: "spring", stiffness: 300, damping: 15 },
                                    exit: { type: "tween", duration: 0.15 }
                                }}
                                viewport={{ once: true }}
                                whileHover={{
                                    cursor: "pointer",
                                    y: -8,
                                    scale: 1.03,
                                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,244,255,0.95))"
                                }}
                            >
                                <Avatar
                                    size="xl"
                                    name={member.name}
                                    src={member.avatar}
                                    mb={4}
                                    bg="linear-gradient(135deg, #6366f1, #ec4899)"
                                    color="white"
                                />
                                <VStack spacing={1} align="center">
                                    <Text
                                        fontWeight="bold"
                                        fontSize="lg"
                                        color="#4F46E5"
                                    >
                                        {member.name}
                                    </Text>
                                    <Text color="gray.500" fontSize="sm">
                                        {member.role}
                                    </Text>
                                </VStack>
                            </MotionFlex>
                        </Link>
                    ))}
                </Grid>
            </MotionBox>

            <MotionBox
                textAlign="center"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                mb={20}
            >
                <Heading fontSize="3xl" mb={6}>
                    {t("readyForWeatherInsights")}
                </Heading>
                <MotionButton
                    size="lg"
                    colorScheme="blue"
                    bgGradient="linear(to-r, #6366f1, #ec4899)"
                    _hover={{ boxShadow: "lg" }}
                    onClick={() => navigate("/dashboard")}
                    fontWeight="bold"
                    borderRadius="xl"
                    py={6}
                >
                    {t("startExploringNow")}
                </MotionButton>
            </MotionBox>
        </MotionBox>
    );
};

export default AboutUs;
