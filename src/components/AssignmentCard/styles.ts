import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    width: 100%;
    gap: 5px;
`
export const Card = styled.View`
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.backgroundAlt};
    width: 100%;
    padding: 10px;
    gap: 10px;
`
export const Column = styled.View`
    display: flex;
`
export const Image = styled.Image`
    border-radius: 10px;
    width: 80px;
    height: 80px;
`
export const Paragraph = styled.Text`
    color: ${({ theme }) => theme.text};
    font-size: 15px;
    font-family: 'urbanist-medium';
`
export const Small = styled.Text`
    position: absolute;
    top: 10px;
    right: 10px;
    color: ${({ theme }) => theme.textAlt};
    font-size: 12px;
    font-family: 'urbanist-regular';
`