import React, { useCallback, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { PauseCircle, PlayCircle } from 'lucide-react';
import { useWavesurfer } from '@wavesurfer/react'

let activeWaveSurfer: WaveSurfer | null = null;

const AudioPlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
    const containerRef = useRef<any | null>(null);

    const { wavesurfer, isPlaying } = useWavesurfer({
        container: containerRef,
        waveColor: 'hsla(0, 0%, 87%, 1)',
        progressColor: '#FF4500',
        cursorWidth: 0,
        barWidth: 2,
        barHeight: 5.5,
        barRadius: 1,
        height: 36,
        hideScrollbar: true,
        backend: 'WebAudio',
        url: audioUrl,
    })

    const handlePlayPause = useCallback(() => {
        if (activeWaveSurfer && activeWaveSurfer !== wavesurfer) {
            activeWaveSurfer.stop();
        }

        if (wavesurfer) {
            if (activeWaveSurfer === wavesurfer) {
                wavesurfer.playPause();
            } else {
                wavesurfer.play();
                activeWaveSurfer = wavesurfer;
            }
        }
    }, [wavesurfer]);

    useEffect(() => {
        return () => {
            if (wavesurfer) {
                wavesurfer.destroy();
                if (activeWaveSurfer === wavesurfer) {
                    activeWaveSurfer = null;
                }
            }
        };
    }, [wavesurfer]);

    return (
        <div className="flex items-center gap-2 rounded-md border w-full px-2 h-10">
            <button onClick={handlePlayPause} type='button' className="text-primary-foreground">
                {isPlaying ? <PauseCircle fill='#FF6347' width={25} /> : <PlayCircle fill='#FF6347' width={25} />}
            </button>
            <div ref={containerRef} className='w-full' />
        </div>
    );
};

export default AudioPlayer;

