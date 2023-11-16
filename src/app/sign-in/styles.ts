import Ionicons from '@expo/vector-icons/Ionicons';
import styled from "styled-components/native";

export const Container = styled.View`
    display: flex;
`
export const Content = styled.View`
    display: flex;
    padding: 15px;
`
export const Mask = styled.View`
    position: absolute;
    flex: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.background};
    opacity: 0.9;
`
export const Accent = styled.Text`
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
    font-family: 'urbanist-bold';
`
export const Title = styled.Text`
    text-align: center;
    font-size: 18px;
    color: ${({ theme }) => theme.text};
    font-family: 'urbanist-bold';
`
export const Small = styled.Text`
    text-align: center;
    font-size: 12px;
    color: ${({ theme }) => theme.textAlt};
    font-family: 'urbanist-regular';
`
export const TitleContainer = styled.View`
    flex-direction: row;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`
export const IconButton = styled.TouchableOpacity`
`
export const Icon = styled(Ionicons).attrs(({ theme }) => ({
    size: 24,
}))`
    color: ${({ theme }) => theme.text};
`
export const Background = styled.ImageBackground.attrs(({ theme }) => ({
    resizeMode: 'cover',
}))`
    display: flex;
    width: 100%;
    height: 100%;
`