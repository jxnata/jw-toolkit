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

export const Background = styled.ImageBackground`
    display: flex;
    width: 100%;
    height: 100%;
`