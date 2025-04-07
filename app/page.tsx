'use client'
import styles from "./page.module.css";
import React, {useEffect, useRef, useState} from "react";
import {fillText} from "@/app/utils/CanvasDrawUtil";
import {Button, Form, Input} from "antd-mobile";

type ImageProps = {
    name: string;
    phone: string;
    address: string;
}

function ImagePreview({props, onImageGenerated}: { props?: ImageProps, onImageGenerated?: () => void }) {
    const [url, setUrl] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current && props) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = 1279;
            const height = 2691;
            canvas.width = width;
            canvas.height = height;
            const backgroundImage = new Image();
            backgroundImage.src = "template.jpg";

            if (ctx) {
                backgroundImage.onload = function () {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(backgroundImage, 0, 0, width, height);

                    fillText(ctx, 50, 'rgba(0, 0, 0, 0.6)', props.address || '', width * 0.11, height * 0.635)
                    fillText(ctx, 50, 'rgba(0, 0, 0, 0.9)', props.name || '', width * 0.31, height * 0.573)
                    fillText(ctx, 50, 'rgba(0, 0, 0, 0.9)', props.phone || '', width * 0.11, height * 0.60)

                    const dataURL = canvas.toDataURL('image/png');
                    setUrl(dataURL);

                    // 当图片渲染完成时调用 onImageGenerated
                    if (onImageGenerated) {
                        onImageGenerated();
                    }
                };
            }
        }
    }, [props, onImageGenerated]);

    return (
        <div className={styles.imageContainer}>
            <canvas ref={canvasRef} style={{display: 'none'}}/>
            {url && <img className={styles.image} src={url} alt="Generated Image"/>}
        </div>
    );
}

function GeneratedForm(props: { onSubmit?: (name: string, phone: string, address: string) => void, loading: boolean }) {
    const [form] = Form.useForm();

    return (
        <Form
            style={{margin: '16px 16px 0'}}
            layout='vertical'
            form={form}
            onFinish={() => {
                if (props.onSubmit) {
                    const {name, phone, address} = form.getFieldsValue();
                    props.onSubmit(name, phone, address);
                }
            }}
            footer={
                <Button style={{backgroundColor: '#3f45ff', border: 'none'}} color='primary' type='submit' block
                        loading={props.loading} loadingText='正在加载'>
                    生成截图
                </Button>
            }
        >
            <Form.Item
                name='name'
                label='姓名：'
                layout='horizontal'
            >
                <Input
                    placeholder='请输入姓名'
                    clearable
                />
            </Form.Item>
            <Form.Item
                name='phone'
                label='手机号：'
                layout='horizontal'
            >
                <Input
                    placeholder='请输入手机号'
                    clearable
                />
            </Form.Item>
            <Form.Item
                name='address'
                label='地址：'
                layout='horizontal'
            >
                <Input
                    placeholder='请输入地址'
                    clearable
                />
            </Form.Item>
        </Form>
    );
}

export default function Home() {
    const [imageProps, setImageProps] = useState<ImageProps>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = (name: string, phone: string, address: string) => {
        setImageProps({name, phone, address});
        setLoading(true);
    };

    return (
        <div className={styles.page}>
            <GeneratedForm onSubmit={handleSubmit} loading={loading}/>
            <div className={styles.tipContainer}>
                <span className="tip">小提示🌀：图片生成后长按保存图片到相册</span>
            </div>

            <ImagePreview
                props={imageProps}
                onImageGenerated={() => setLoading(false)}
            />
        </div>
    );
}
