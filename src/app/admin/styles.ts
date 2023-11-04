import styled from "styled-components/native";

export const Container = styled.View`
    display: flex;
`

export const Content = styled.View`
    display: flex;
    padding: 15px;
    margin-top: 90px;
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

export const Paragraph = styled.Text`
    font-size: 15px;
    color: ${({ theme }) => theme.text};
    padding: 20px 10px;
`

export const Background = styled.ImageBackground.attrs(({ theme }) => ({
    resizeMode: 'cover',
}))`
    display: flex;
    width: 100%;
    height: 100%;
`