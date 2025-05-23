import React, {DragEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './img-compare.css'

import TestBeforeImg from '@assets/before.jpg'
import TestAfterImg from '@assets/after.jpg'

const ZOOM_MIN: number = 0.5;
const ZOOM_MAX: number = 4;
const NB_DECIMALS = 2

type ImageCompareProps = {
    after?: string;
    before?: string;
    full?: boolean;
    hideAfter?: boolean;
    hideHandle?: boolean;
    isDraggable?: boolean;
    isSwitchable?: boolean;
    isZoomable?: boolean;
    labels?: {
        after?: string;
        before?: string;
    };
    padding: {
        left: number;
        right: number;
    };
    zoom?: {
        max?: number;
        min?: number;
    };
};


const ImageCompare: React.FC<ImageCompareProps> = ({
                                                       before = TestBeforeImg,
                                                       after = TestAfterImg,
                                                       full = false,
                                                       hideAfter = false,
                                                       hideHandle = false,
                                                       isDraggable = true,
                                                       isSwitchable = true,
                                                       isZoomable = true,
                                                       labels = {after: 'After', before: 'Before'},
                                                       padding = {left: 0, right: 0},
                                                   }) => {

    const [beforeName, setBeforeName] = useState<string>(labels.before ?? 'Before');
    const [afterName, setAfterName] = useState<string>(labels.after ?? 'After');

    const [afterSize, setAfterSize] = useState<string>('');
    const [beforeSize, setBeforeSize] = useState<string>('');

    const [allowNextFrame, setAllowNextFrame] = useState<boolean>(true);

    const [diffX, setDiffX] = useState<number>(0);
    const [diffY, setDiffY] = useState<number>(0);

    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const [isDraggingHandle, setIsDraggingHandle] = useState<boolean>(false);
    const [isDraggingImage, setIsDraggingImage] = useState<boolean>(false);

    const [mutableBefore, setMutableBefore] = useState<string>(before);
    const [mutableAfter, setMutableAfter] = useState<string>(after);

    const [mutableZoom, setMutableZoom] = useState<number>(1);

    const [pageX, setPageX] = useState<number>(0);
    const [pageY, setPageY] = useState<number>(0);
    const [posX, setPosX] = useState<number>(0);

    const [shiftX, setShiftX] = useState<number>(0);
    const [shiftY, setShiftY] = useState<number>(0);

    const [showAfter, setShowAfter] = useState<boolean>(true);
    const [showDropzone, setShowDropzone] = useState<boolean>(false);

    const [paddingTotal, setPaddingTotal] = useState(0);

    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setPaddingTotal(padding.left + padding.right);
    }, []);

    useEffect(() => {
        setInitialPosX(width);
    }, [paddingTotal]);

    const addGlobalListeners = () => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('resize', onResize);
        window.addEventListener('contextmenu', onRightClick);
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragover', onDragOver);
        window.addEventListener('drop', onDrop);
    };

    const removeGlobalListeners = () => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('contextmenu', onRightClick);
        window.removeEventListener('dragenter', onDragEnter);
        window.removeEventListener('dragover', onDragOver);
        window.removeEventListener('drop', onDrop);
    };


    useEffect(() => {
        const init = () => {
            if (elementRef.current) {
                elementRef.current.addEventListener('wheel', onWheel);

                const newWidth = elementRef.current.clientWidth;
                const newHeight = elementRef.current.clientHeight;

                setWidth(newWidth);
                setHeight(newHeight);

                setInitialPosX(newWidth);
            }

            addGlobalListeners();
        };

        requestAnimationFrame(init);

        return () => {
            removeGlobalListeners();

            if (elementRef.current) {
                elementRef.current.removeEventListener('wheel', onWheel);
            }
        };
    }, []);

    const isDragging = useMemo(() => {
        return isDraggingImage || isDraggingHandle;
    }, [isDraggingImage, isDraggingHandle]);

    const dimensions = useMemo(() => {
        const zoom = Number.parseFloat(mutableZoom.toFixed(NB_DECIMALS));

        const styles = {
            height: full ? `${height}px` : 'auto',
            transform: `scale(${zoom}) translate(${shiftX}px, ${shiftY}px)`,
            width: `${width}px`,
        };

        return styles;

    }, [mutableZoom, full, height, width, shiftX, shiftY]);

    // const dimensions = useMemo(() => {
    //     const zoom = Number.parseFloat(mutableZoom.toFixed(NB_DECIMALS));
    //
    //     const styles = {
    //         height: full ? '100vh' : 'auto',
    //         width: full ? '100vw' : `${width}px`,
    //         transform: `scale(${zoom}) translate(${shiftX}px, ${shiftY}px)`,
    //         border: '1px solid red', // Bordure pour voir les limites
    //     };
    //
    //     console.log('Dimensions:', styles);
    //     return styles;
    //
    // }, [mutableZoom, full, height, width, shiftX, shiftY]);


    const onMovement = useCallback(() => {
        // console.log('Movement detected');
        // Autres actions ici si nécessaire...
    }, []);

    const getFileName = (file: File) => {
        return file.name
    };

    const getFileSize = (file: File) => {
        const nbInKo = 1024
        return `(${Math.round(file.size / nbInKo)} Ko)`
    };

    const loadFile = (file: File, leftSide: boolean | FileList) => {
        const reader = new FileReader()

        reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
            if (leftSide) {
                setAfterName(getFileName(file));
                setAfterSize(getFileSize(file));
                setMutableAfter(event.target?.result as string)
            } else {
                setBeforeName(getFileName(file));
                setBeforeSize(getFileSize(file));
                setMutableBefore(event.target?.result as string)
            }
        })

        reader.readAsDataURL(file)
    };

    const onDragEnter = () => {
        if (!isSwitchable) return

        setShowDropzone(true)
    };

    const onDragOver = (event: DragEvent) => {
        if (!isSwitchable) return

        event.preventDefault()
    };

    const onDrop = (event: any) => {
        if (isSwitchable) {
            event.preventDefault();

            setShowDropzone(false);
            const files = event.dataTransfer.files;


            if (files.length === 1) {
                const x = event.clientX;
                const half = Math.round(window.outerWidth / NB_DECIMALS);
                const leftSide = x <= half;

                loadFile(files[0], leftSide);
            } else {
                console.debug('drop files :', files);
                loadFile(files[0], true);
                loadFile(files[1], false);
            }

            setMutableZoom(1);
            setShowAfter(true);

            onResize();
        }
    };

    const onMouseDownHandle = (event: React.MouseEvent) => {
        event.preventDefault();

        onMovement();
        setIsDraggingHandle(true);
    };

    const onMouseDownImage = (event: any) => {
        event.preventDefault();

        if (!isDraggable) return

        setIsDraggingImage(true);
        onMovement();
    }

    const onMouseMove = (event: any) => {
        event.preventDefault();

        if (onMovement) onMovement();
        if (event && event.type === 'click' && isDraggable) return;

        const currentDragging = isDragging;

        if (event && allowNextFrame && currentDragging) {
            setAllowNextFrame(false);

            let currentPageX = event.pageX;
            let currentPageY = event.pageY;

            if ('touches' in event) {
                currentPageX = event.touches[0].pageX;
                currentPageY = event.touches[0].pageY;
            } else {
                currentPageX = event.pageX;
                currentPageY = event.pageY;
            }

            const calculatedDiffX = pageX ? currentPageX - pageX : 0;
            const calculatedDiffY = pageY ? currentPageY - pageY : 0;

            setDiffX(calculatedDiffX);
            setDiffY(calculatedDiffY);
            setPageX(currentPageX);
            setPageY(currentPageY);

            window.requestAnimationFrame(updatePosition);
        }
    }

    const onMouseUp = (event: MouseEvent & React.TouchEvent) => {
        event.preventDefault()

        setIsDraggingHandle(false);
        setIsDraggingImage(false);
        setPageX(0)
        setPageY(0)

        if (event.button === 1) onWheelClick()
    }

    const onResize = () => {
        if (elementRef.current) {
            const newWidth = elementRef.current.clientWidth;
            const newHeight = elementRef.current.clientHeight;

            setWidth(newWidth);
            setHeight(newHeight);
            setInitialPosX(newWidth);
        }
    };

    const onRightClick = (event: MouseEvent) => {
        event.preventDefault()

        switchImages()
    };

    const onWheel = (event: React.WheelEvent) => {
        if (!isZoomable) return;

        event.preventDefault()

        const scale = 0.001;

        setMutableZoom((prevZoom) => {
            const newZoom = prevZoom - event.deltaY * scale;

            // Limiter le zoom entre les valeurs min et max
            if (newZoom > ZOOM_MAX) return ZOOM_MAX;
            if (newZoom < ZOOM_MIN) return ZOOM_MIN;

            return newZoom;
        });
    }


    const onWheelClick = () => {
        const nbFlicks = 10;
        const delayBetweenFlicks = 100;

        for (let index = 0; index < nbFlicks; index += 1) {
            setTimeout(() => {
                switchImages();
            }, index * delayBetweenFlicks);
        }

        setTimeout(() => {
            setShowAfter(true); // reset after visibility
        }, nbFlicks * delayBetweenFlicks);
    };

    const setInitialPosX = (currentWidth: number) => {
        if (paddingTotal > currentWidth) {
            console.log('Sum of paddings is wider than parent element!');
            return;
        }

        const half = 2;

        setPosX((currentWidth + padding.left - padding.right) / half);
    };


    const switchImages = () => {
        setShowAfter((prev) => !prev);
    };

    const updatePosition = () => {
        if (!isDraggable || (isDraggable && isDraggingHandle)) {
            if (elementRef.current) {
                let posX = pageX - elementRef.current.getBoundingClientRect().left;

                const pr = padding.right;
                const pl = padding.left;

                if (posX < pl) {
                    posX = pl
                } else if (posX > width - pr) {
                    posX = width - pr;
                }

                setPosX(posX);
            }
        }

        if (isDraggingImage) {
            setShiftX((prevShiftX) => prevShiftX + diffX / mutableZoom);
            setShiftY((prevShiftY) => prevShiftY + diffY / mutableZoom);
        }

        setAllowNextFrame(true);
    };

    const resetZoomAndPosition = () => {
        setMutableZoom(1);

        setShiftX(0);
        setShiftY(0);

        if (elementRef.current) {
            const newWidth = elementRef.current.clientWidth;
            setPosX((newWidth + padding.left - padding.right) / 2);
        }
    };

    return (
        <div className={'container-compare'}>
            <figure ref={elementRef}
                    className={`image-compare ${full ? 'full' : ''}`}
                    onClick={onMouseMove}
                    onMouseMove={onMouseMove}
            >
                <div className={`drop-zone ${showDropzone ? 'visible' : ''}`}>
                    Drop 1 or 2 images here!
                </div>

                {!hideAfter && showAfter && (
                    <div
                        className="wrapper"
                        style={{width: `${posX}px`}}
                        onMouseDown={onMouseDownImage}
                    >
                        <img src={mutableAfter} style={dimensions} alt="after"/>

                        {afterName && (
                            <div className="after-name">
                                {afterName}
                                {afterSize && <div className="size">{afterSize}</div>}
                            </div>
                        )}
                    </div>
                )}

                <img
                    src={mutableBefore}
                    style={dimensions}
                    onMouseDown={onMouseDownImage}
                    alt="before"
                />

                {!hideAfter && !hideHandle && (
                    <div
                        className="handle"
                        style={{left: `${posX}px`}}
                        onMouseDown={onMouseDownHandle}
                    >

          <span className="handle-icon left">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor"
                                                                                         d="M16 19L5 12l11-7z"/></svg>
          </span>
                        <span className="handle-icon right">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor"
                                                                                         d="M8 19V5l11 7z"/></svg>
          </span>
                    </div>
                )}

                {beforeName && (
                    <div className="before-name">
                        {beforeName}
                        {beforeSize && <div className="size">{beforeSize}</div>}
                    </div>
                )}
            </figure>

            <button onClick={resetZoomAndPosition} className="reset-button">
                Reset
            </button>
        </div>
    );
}

export default ImageCompare;
